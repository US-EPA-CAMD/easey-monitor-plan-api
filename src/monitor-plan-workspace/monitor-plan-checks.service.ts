import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorSystemCheckService } from '../monitor-system-workspace/monitor-system-checks.service';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { MonitorSpanChecksService } from '../monitor-span-workspace/monitor-span-checks.service';

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
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
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

    payload.locations.forEach((monitorLocation, locIdx) => {
      const locationId = locationIdentifiers.find(i => {
        return (
          i.unitId === monitorLocation.unitId &&
          i.stackPipeId === monitorLocation.stackPipeId
        );
      }).locationId;

      monitorLocation.matsMethods?.forEach((matsMethod, matsMetIdx) => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.matsMethodChecksService.runChecks(
              matsMethod,
              true,
              false,
              `locations.${locIdx}.matsMethods.${matsMetIdx}.`,
            );

            resolve(results);
          }),
        );
      });

      monitorLocation.unitControls?.forEach((unitControl, ucIdx) => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.unitControlChecksService.runChecks(
              locationId,
              null,
              unitControl,
              true,
              false,
              `locations.${locIdx}.unitControls.${ucIdx}.`,
              monitorLocation,
            );

            resolve(results);
          }),
        );
      });

      monitorLocation.spans?.forEach((span, spanIdx) => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.monSpanChecksService.runChecks(
              span,
              locationId,
              true,
              false,
              `locations.${locIdx}.span.${spanIdx}.`,
            );
            resolve(results);
          }),
        );
      });

      monitorLocation.components?.forEach((component, compIdx) => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.componentChecksService.runChecks(
              locationId,
              component,
              true,
              false,
              `locations.${locIdx}.components.${compIdx}.`,
            );

            resolve(results);
          }),
        );
      });

      monitorLocation.systems?.forEach((system, sysIdx) => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.monSysCheckService.runChecks(
              locationId,
              system,
              true,
              false,
              `locations.${locIdx}.systems.${sysIdx}.`,
            );

            resolve(results);
          }),
        );
      });
    });

    this.throwIfErrors(await this.extractErrors(promises));
  }
}
