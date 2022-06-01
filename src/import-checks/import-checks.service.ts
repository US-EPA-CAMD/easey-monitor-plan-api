import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { Check32, Check6 } from './mp-file-checks/component';
import { Check3, Check4, Check8 } from './mp-file-checks/facility-unit';
import { Check9 } from './mp-file-checks/formula';
import { Check11, Check12 } from './mp-file-checks/qual';
import { Check10 } from './mp-file-checks/span';
import { Check31, Check5, Check7 } from './mp-file-checks/system';
import { Check1, Check2 } from './mp-file-checks/unit-stack-config';
import { Check, CheckResult } from './utilities/check';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly componentService: ComponentWorkspaceService,
  ) {}

  private async runImportChecks(monPlan: UpdateMonitorPlanDTO) {
    let errorList = [];

    for (const location of monPlan.locations) {
      errorList.push(
        ...(await this.componentService.runComponentChecks(
          location.components,
          location,
          '', //TODO GET MONITOR LOCATION ID REFACTORING
        )),
      );
    }

    if (errorList.length > 0) {
      throw new BadRequestException(errorList, 'Validation Failure');
    }
  }

  private runCheckQueue = async (
    checkQueue: Check[],
    monPlan: UpdateMonitorPlanDTO,
  ): Promise<CheckResult[]> => {
    const checkListResults = [];

    for (const check of checkQueue) {
      const checkRun = await check.executeCheck(monPlan);

      if (checkRun.checkResult === false) {
        checkListResults.push(checkRun);
      }
    }

    if (checkListResults.length > 0) {
      const ErrorList = [];
      checkListResults.forEach(checkListResult => {
        ErrorList.push(...checkListResult.checkErrorMessages);
      });
      throw new BadRequestException(ErrorList, 'Validation Failure');
    }

    return checkListResults;
  };

  mpFileChecks = async (monPlan: UpdateMonitorPlanDTO) => {
    this.logger.info('Running monitoring plan import file checks...', {
      orisCode: monPlan.orisCode,
    });
    const LocationChecks = [
      Check1,
      Check2,
      Check5,
      Check6,
      Check7,
      Check9,
      Check10,
      Check11,
      Check12,
      Check31,
      Check32,
    ];

    const UnitStackChecks1 = [Check3];
    const UnitStackChecks2 = [Check4, Check8]; //Depends on UnitStackChecks1 Passing

    await this.runCheckQueue(LocationChecks, monPlan);
    if (monPlan.unitStackConfiguration !== undefined) {
      await this.runCheckQueue(UnitStackChecks1, monPlan);
      await this.runCheckQueue(UnitStackChecks2, monPlan);
    }

    this.logger.info(
      'Successfully completed monitor plan import with no errors',
      {
        orisCode: monPlan.orisCode,
      },
    );
  };
}
