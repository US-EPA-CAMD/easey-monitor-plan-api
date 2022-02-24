import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { Check32, Check6, Check7 } from './file-checks/component';
import { Check3, Check4, Check8 } from './file-checks/facility-unit';
import { Check9 } from './file-checks/formula';
import { Check11, Check12 } from './file-checks/qual';
import { Check10 } from './file-checks/span';
import { Check31, Check5 } from './file-checks/system';
import { Check1, Check2 } from './file-checks/unit-stack-config';
import { Check, CheckResult } from './utilities/check';

@Injectable()
export class ImportChecksService {
  constructor() {}

  runCheckQueue = async (
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

  fileCheckValidation = async (monPlan: UpdateMonitorPlanDTO) => {
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
    const UnitStackChecks = [Check3, Check4, Check8];
    await this.runCheckQueue(LocationChecks, monPlan);
    if (monPlan.unitStackConfiguration !== undefined) {
      await this.runCheckQueue(UnitStackChecks, monPlan);
    }
  };
}
