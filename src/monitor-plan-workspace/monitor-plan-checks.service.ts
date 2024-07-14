import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { MonitorSpanChecksService } from '../monitor-span-workspace/monitor-span-checks.service';
import { MonitorSystemCheckService } from '../monitor-system-workspace/monitor-system-checks.service';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';
import { UnitStackConfigurationChecksService } from '../unit-stack-configuration-workspace/unit-stack-configuration-checks.service';

@Injectable()
export class MonitorPlanChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: MonitorLocationChecksService,
    private readonly matsMethodChecksService: MatsMethodChecksService,
    private readonly unitControlChecksService: UnitControlChecksService,
    private readonly componentChecksService: ComponentCheckService,
    private readonly monSysCheckService: MonitorSystemCheckService,
    private readonly monSpanChecksService: MonitorSpanChecksService,
    private readonly unitStackConfigurationChecksService: UnitStackConfigurationChecksService,
  ) {}

  private async extractErrors(
    promises: Promise<string[]>[],
  ): Promise<string[]> {
    const errorList: string[] = [];
    const errors = await Promise.all(promises);
    errors.forEach(p => {
      errorList.push(...p);
    });
    return [...new Set(errorList)];
  }

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async runChecks(payload: UpdateMonitorPlanDTO) {
    const promises: Promise<string[]>[] = [];

    let errors: string[] = [];
    let errorList: string[] = [];
    let locationIdentifiers: LocationIdentifiers[] = [];

    [locationIdentifiers, errors] = await this.locationChecksService.runChecks(
      payload,
    );
    errorList.push(...errors);
    this.throwIfErrors(errorList);

    payload.unitStackConfigurationData.forEach(usc => {
      promises.push(this.unitStackConfigurationChecksService.runChecks(usc));
    });

    payload.monitoringLocationData.forEach((monitorLocation, locIdx) => {
      const locationId = locationIdentifiers.find(i => {
        return (
          i.unitId === monitorLocation.unitId &&
          i.stackPipeId === monitorLocation.stackPipeId
        );
      }).locationId;

      monitorLocation.supplementalMATSMonitoringMethodData?.forEach(
        (matsMethod, matsMetIdx) => {
          if (!matsMethod.endDate) {
            promises.push(
              this.matsMethodChecksService.runChecks(
                matsMethod,
                true,
                false,
                `locations.${locIdx}.matsMethods.${matsMetIdx}.`,
              ),
            );
          }
        },
      );

      monitorLocation.unitControlData?.forEach((unitControl, ucIdx) => {
        promises.push(
          this.unitControlChecksService.runChecks(
            null,
            unitControl,
            true,
            false,
            `locations.${locIdx}.unitControls.${ucIdx}.`,
            monitorLocation,
          ),
        );
      });

      monitorLocation.monitoringSpanData?.forEach((span, spanIdx) => {
        if (!span.endDate) {
          promises.push(
            this.monSpanChecksService.runChecks(
              span,
              locationId,
              false,
              `locations.${locIdx}.span.${spanIdx}.`,
            ),
          );
        }
      });

      monitorLocation.componentData?.forEach((component, compIdx) => {
        promises.push(
          this.componentChecksService.runChecks(
            locationId,
            component,
            true,
            false,
            `locations.${locIdx}.components.${compIdx}.`,
          ),
        );
      });

      monitorLocation.monitoringSystemData?.forEach((system, sysIdx) => {
        if (!system.endDate) {
          promises.push(
            this.monSysCheckService.runChecks(
              locationId,
              system,
              true,
              false,
              `locations.${locIdx}.systems.${sysIdx}.`,
            ),
          );
        }
      });
    });

    this.throwIfErrors(await this.extractErrors(promises));
  }
}
