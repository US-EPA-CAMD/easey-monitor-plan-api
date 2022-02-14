import { BadRequestException } from '@nestjs/common';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';

interface CheckResult {
  checkName: string;
  checkDescription: string;
  checkResult: boolean;
  checkErrorMessages: string[];
}

const Check3 = (monPlan: UpdateMonitorPlanDTO): CheckResult => {
  const check: CheckResult = {
    checkName: 'Check3',
    checkDescription:
      'The UnitStackConfigurationData.StackPipeID AND UnitStackConfigurationData.UnitID elements have defined values and are unique combinations',
    checkResult: true,
    checkErrorMessages: [],
  };

  const stackPipeIdToUnitId = new Map<string, number>();

  monPlan.unitStackConfiguration.forEach(entry => {
    let hasUnitId = true;
    let hasStackPipeId = true;

    if (entry.unitId === null || entry.unitId === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        'Unit Stack Configuration unitId must be set',
      );
      hasUnitId = false;
    }
    if (entry.stackPipeId === null || entry.stackPipeId === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        'Unit Stack Configuration stackPipeId must be set',
      );
      hasStackPipeId = false;
    }

    if (hasUnitId && hasStackPipeId) {
      if (
        stackPipeIdToUnitId.has(entry.stackPipeId) &&
        stackPipeIdToUnitId.get(entry.stackPipeId) === entry.unitId
      ) {
        check.checkResult = false;
        check.checkErrorMessages.push(
          `Unit Stack Configuration stackPipeId-${entry.stackPipeId} contains duplicate unit id entry`,
        );
      } else {
        stackPipeIdToUnitId.set(entry.stackPipeId, entry.unitId);
      }
    }
  });

  return check;
};

const Check4 = (monPlan: UpdateMonitorPlanDTO): CheckResult => {
  const check: CheckResult = {
    checkName: 'Check4',
    checkDescription:
      'The UnitStackConfigurationData.StackPipeID value has a matching MonitoringLocationData.StackPipeID value',
    checkResult: true,
    checkErrorMessages: [],
  };

  const monitorLocationDataStackPipeIds = new Set<string>();
  monPlan.locations.forEach(entry => {
    if (!(entry.stackPipeId === null || entry.stackPipeId === undefined)) {
      monitorLocationDataStackPipeIds.add(entry.stackPipeId);
    }
  });

  monPlan.unitStackConfiguration.forEach(entry => {
    if (!(entry.stackPipeId === null || entry.stackPipeId === undefined)) {
      if (!monitorLocationDataStackPipeIds.has(entry.stackPipeId)) {
        check.checkResult = false;
        check.checkErrorMessages.push(
          `Unit Stack Configuration stackPipeId-${entry.stackPipeId} does not have matching record in Monitor Location Data`,
        );
      }
    }
  });

  return check;
};

const Check8 = (monPlan: UpdateMonitorPlanDTO): CheckResult => {
  const check: CheckResult = {
    checkName: 'Check8',
    checkDescription:
      'The UnitStackConfigurationData.UnitID value has a matching MonitoringLocationData.UnitID value',
    checkResult: true,
    checkErrorMessages: [],
  };

  const monitorLocationDataUnitIds = new Set<number>();
  monPlan.locations.forEach(entry => {
    if (!(entry.unitId === null || entry.unitId === undefined)) {
      monitorLocationDataUnitIds.add(+entry.unitId);
      console.log(entry.unitId);
    }
  });

  monPlan.unitStackConfiguration.forEach(entry => {
    if (!(entry.unitId === null || entry.unitId === undefined)) {
      if (!monitorLocationDataUnitIds.has(entry.unitId)) {
        check.checkResult = false;
        check.checkErrorMessages.push(
          `Unit Stack Configuration unitId-${entry.unitId} does not have matching record in Monitor Location Data`,
        );
      }
    }
  });

  return check;
};

export const unitStackConfigurationValid = (monPlan: UpdateMonitorPlanDTO) => {
  const CheckList = [Check3, Check4, Check8];
  let CheckListResults = [];

  CheckList.forEach(check => {
    CheckListResults.push(check(monPlan));
  });

  CheckListResults = CheckListResults.filter(
    entry => entry.checkResult === false,
  );

  if (CheckListResults.length > 0) {
    const ErrorList = CheckListResults.map(entry => entry.checkErrorMessages);
    throw new BadRequestException(ErrorList, 'Validation Failure');
  }
};
