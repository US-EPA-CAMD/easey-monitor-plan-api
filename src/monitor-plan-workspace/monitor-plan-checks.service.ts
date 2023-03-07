import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorSystemCheckService } from '../monitor-system-workspace/monitor-system-checks.service';

@Injectable()
export class MonitorPlanChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly matsMethodChecksService: MatsMethodChecksService,
    private readonly unitControlChecksService: UnitControlChecksService,
    private readonly componentChecksService: ComponentCheckService,
    private readonly monSysCheckService: MonitorSystemCheckService,
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
    this.logger.info('Running Monitor Plan Checks');

    const promises: Promise<string[]>[] = [];

    if (payload.locations) {
      for (const monitorLocation of payload.locations) {
        monitorLocation.matsMethods?.forEach(matsMethod => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.matsMethodChecksService.runChecks(
                matsMethod,
                true,
                false,
              );

              resolve(results);
            }),
          );
        });

        monitorLocation.unitControls?.forEach(unitControl => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.unitControlChecksService.runChecks(
                unitControl,
                null,
                null,
                true,
                false,
                monitorLocation,
                monitorLocation.unitId,
              );

              resolve(results);
            }),
          );
        });

        monitorLocation.components?.forEach(component => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.componentChecksService.runChecks(
                component,
                true,
                false,
              );

              resolve(results);
            }),
          );
        });

        monitorLocation.systems?.forEach(system => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.monSysCheckService.runChecks(
                system,
                true,
                false,
              );

              resolve(results);
            }),
          );
        });
      }
    }

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed Monitor Plan Checks');
  }
}
