import { BadRequestException } from '@nestjs/common';
import { Plant } from 'src/entities/workspace/plant.entity';
import { Unit } from 'src/entities/workspace/unit.entity';
import { getManager } from 'typeorm';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';

class CheckResult {
  public checkName: string = '';
  public checkDescription: string = '';
  public checkResult: boolean = true;
  public checkErrorMessages: string[] = [];

  constructor(checkN, checkD) {
    this.checkName = checkN;
    this.checkDescription = checkD;
  }
}

const Check3 = (monPlan: UpdateMonitorPlanDTO): CheckResult => {
  const check = new CheckResult(
    'Check3',
    'The UnitStackConfigurationData.StackPipeID AND UnitStackConfigurationData.UnitID elements have defined values and are unique combinations',
  );

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
  const check = new CheckResult(
    'Check4',
    'The UnitStackConfigurationData.StackPipeID value has a matching MonitoringLocationData.StackPipeID value',
  );

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
  const check = new CheckResult(
    'Check8',
    'The UnitStackConfigurationData.UnitID value has a matching MonitoringLocationData.UnitID value',
  );

  const monitorLocationDataUnitIds = new Set<number>();
  monPlan.locations.forEach(entry => {
    if (!(entry.unitId === null || entry.unitId === undefined)) {
      monitorLocationDataUnitIds.add(+entry.unitId);
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

const Check1 = async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
  const check = new CheckResult(
    'Check1',
    'MP Facility Present in the Production Facility Table',
  );

  const entityManager = getManager();

  const facResult = await entityManager.findOne(Plant, {
    orisCode: monPlan.orisCode,
  });
  if (facResult === undefined) {
    check.checkResult = false;
    check.checkErrorMessages.push(
      `No matching orisCode-${monPlan.orisCode} found on workspace camd.plant table`,
    );
    return check;
  }

  for (const entry of monPlan.locations) {
    const unitResult = await entityManager.findOne(Unit, {
      name: entry.unitId,
      facId: facResult.id,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `No matching unitId-${entry.unitId} and facId-${facResult.id} found on workspace camd.unit table`,
      );
    }
  }

  return check;
};

const runCheckQueue = (
  checkQueue: Function[],
  monPlan: UpdateMonitorPlanDTO,
): CheckResult[] => {
  const checkListResults = [];

  checkQueue.forEach(check => {
    const checkRun = check(monPlan);

    if (checkRun.checkResult === false) {
      checkListResults.push(checkRun);
    }
  });

  if (checkListResults.length > 0) {
    const ErrorList = checkListResults.map(entry => entry.checkErrorMessages);
    throw new BadRequestException(ErrorList, 'Validation Failure');
  }

  return checkListResults;
};

export const unitStackConfigurationValid = async (
  monPlan: UpdateMonitorPlanDTO,
) => {
  const FileChecks = [Check3, Check4, Check8];
  const SchemaChecks = [Check1];

  runCheckQueue(FileChecks, monPlan);
  runCheckQueue(SchemaChecks, monPlan);
};
