import { BadRequestException } from '@nestjs/common';
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { Check3, Check4, Check8 } from '../facility-unit';
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
    const ErrorList = checkListResults.map(entry => entry.checkErrorMessages);
    throw new BadRequestException(ErrorList, 'Validation Failure');
  }

  return checkListResults;
};

export const unitStackConfigurationValid = async (
  monPlan: UpdateMonitorPlanDTO,
) => {
  const FileChecks = [Check8];
  const LocationChecks = [Check1, Check2];
  const UnitStackChecks = [Check3, Check4];

  if (monPlan.unitStackConfiguration !== undefined) {
    await runCheckQueue(LocationChecks, monPlan);
    await runCheckQueue(FileChecks, monPlan);
    await runCheckQueue(UnitStackChecks, monPlan);
  } else {
    await runCheckQueue(LocationChecks, monPlan);
  }
};
