import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MatsMethodChecksService } from '../mats-method-workspace/mats-method-checks.service';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UnitControlChecksService } from '../unit-control-workspace/unit-control-checks.service';

@Injectable()
export class MonitorPlanChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly matsMethodChecksService: MatsMethodChecksService,
    private readonly unitControlsChecksService: UnitControlChecksService,
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

  async runChecks(payload: MonitorPlanDTO) {
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
              const results = this.unitControlsChecksService.runChecks(
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
      }
    }

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed Monitor Plan Checks');
  }
}
