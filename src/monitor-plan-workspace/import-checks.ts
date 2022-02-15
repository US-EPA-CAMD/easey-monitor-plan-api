import { BadRequestException } from '@nestjs/common';
import { StackPipe } from '../entities/stack-pipe.entity';
import { Plant } from 'src/entities/workspace/plant.entity';
import { Unit } from 'src/entities/workspace/unit.entity';
import { getManager } from 'typeorm';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitStackConfiguration } from 'src/entities/unit-stack-configuration.entity';

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

class Check {
  public check: Function;
  public args: Object[] = [];

  constructor(checkFunc, argList?) {
    this.check = checkFunc;

    if (argList) {
      this.args = argList;
    }
  }

  public async executeCheck(
    monPlan: UpdateMonitorPlanDTO,
  ): Promise<CheckResult> {
    return this.check(monPlan, ...this.args);
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

const Check1A = async (
  monPlan: UpdateMonitorPlanDTO,
  tableName: string,
): Promise<CheckResult> => {
  const entityManager = getManager();

  const check = new CheckResult(
    'Check1A',
    'MP Facility Present in the Production Facility Table',
  );

  const facilityId = await getFacIdFromOris(monPlan.orisCode);
  if (facilityId === null) {
    check.checkResult = false;
    check.checkErrorMessages.push(
      `No matching orisCode-${monPlan.orisCode} found on workspace camd.plant table`,
    );
    return check;
  }

  for (const entry of monPlan[tableName]) {
    const unitResult = await entityManager.findOne(Unit, {
      name: entry.unitId,
      facId: facilityId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `No matching unitId-${entry.unitId} and orisCode-${monPlan.orisCode} found on workspace camd.unit table`,
      );
    }
  }

  return check;
};

const Check1B = async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
  const entityManager = getManager();

  const check = new CheckResult(
    'Check1B',
    'Camdecmpswks.stack_pipe contains one record with stack_name=UnitStackConfiguration.StackPipeID from file and fac_id=camd.plant',
  );

  const facilityId = await getFacIdFromOris(monPlan.orisCode);
  if (facilityId === null) {
    check.checkResult = false;
    check.checkErrorMessages.push(
      `No matching orisCode-${monPlan.orisCode} found on workspace camd.plant table`,
    );
    return check;
  }

  for (const entry of monPlan.unitStackConfiguration) {
    const unitResult = await entityManager.findOne(StackPipe, {
      id: entry.stackPipeId,
      facId: facilityId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `No matching stackPipeId-${entry.stackPipeId} and unitId-${entry.unitId} found on workspace Camdecmpswks.stack_pipe table`,
      );
    }
  }

  return check;
};

const Check1C = async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
  const entityManager = getManager();

  const check = new CheckResult(
    'Check1C',
    'Confirm camdecmpswks.unit_stack_configuration contains one record for each combination of (UnitStackConfiguration.StackPipeId, UnitStackConfiguration.UnitID)',
  );

  const facilityId = await getFacIdFromOris(monPlan.orisCode);
  if (facilityId === null) {
    check.checkResult = false;
    check.checkErrorMessages.push(
      `No matching orisCode-${monPlan.orisCode} found on workspace camd.plant table`,
    );
    return check;
  }

  for (const entry of monPlan.unitStackConfiguration) {
    const unitResult = await entityManager.findOne(UnitStackConfiguration, {
      unitId: entry.unitId,
      stackPipeId: entry.stackPipeId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `No matching stackPipeId-${entry.stackPipeId} and unitId-${entry.unitId} found on workspace camdecmpswks.unit_stack_configuration table`,
      );
    }
  }

  return check;
};

const getFacIdFromOris = async (orisCode: number): Promise<number> => {
  const entityManager = getManager();

  const facResult = await entityManager.findOne(Plant, {
    orisCode: orisCode,
  });
  if (facResult === undefined) {
    return null;
  } else {
    return facResult.id;
  }
};

const runCheckQueue = async (
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
  const FileChecks = [new Check(Check3), new Check(Check4), new Check(Check8)];
  const StackPipeChecks = [
    new Check(Check1A, ['unitStackConfiguration']),
    new Check(Check1B),
    new Check(Check1C),
  ];
  const SingleUnitChecks = [new Check(Check1A, ['locations'])];

  if (monPlan.unitStackConfiguration !== undefined) {
    await runCheckQueue(FileChecks, monPlan);
    await runCheckQueue(StackPipeChecks, monPlan);
  } else {
    await runCheckQueue(SingleUnitChecks, monPlan);
  }
};
