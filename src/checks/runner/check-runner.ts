import { BadRequestException } from '@nestjs/common';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { Check32, Check6, Check7 } from '../component';
import { Check3, Check4, Check8 } from '../facility-unit';
import { Check9 } from '../formula';
import { Check11, Check12 } from '../qual';
import { Check10 } from '../span';
import { Check31, Check5 } from '../system';
import { Check1, Check2 } from '../unit-stack-config';
import { Check, CheckResult } from '../utilities/check';

export const runCheckQueue = async (
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

export const unitStackConfigurationValid = async (
  monPlan: UpdateMonitorPlanDTO,
) => {
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
  await runCheckQueue(LocationChecks, monPlan);
  if (monPlan.unitStackConfiguration !== undefined) {
    await runCheckQueue(UnitStackChecks, monPlan);
  }
};
