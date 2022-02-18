import { BadRequestException } from '@nestjs/common';
import { StackPipe } from '../entities/stack-pipe.entity';
import { Plant } from '../entities/workspace/plant.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { getManager } from 'typeorm';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';

class CheckResult {
  public checkName = '';
  public checkDescription = '';
  public checkResult = true;
  public checkErrorMessages = [];

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

export const Check1 = async (
  monPlan: UpdateMonitorPlanDTO,
): Promise<CheckResult> => {
  const check = new CheckResult(
    'Check1',
    'MP Facility Present in the Production Facility Table Facility (ORIS Code) must be present in the database',
  );

  if ((await getFacIdFromOris(monPlan.orisCode)) === null) {
    check.checkResult = false;
    check.checkErrorMessages.push(
      `The database doesn't contain any Facility with Oris Code ${monPlan.orisCode}`,
    );
  }

  return check;
};

export const Check2 = async (
  monPlan: UpdateMonitorPlanDTO,
): Promise<CheckResult> => {
  const entityManager = getEntityManager();

  const check = new CheckResult(
    'Check2',
    'Unit/Stack Present in the Production Unit Table and associated to the import facility',
  );

  const facilityId = await getFacIdFromOris(monPlan.orisCode);
  for (const entry of monPlan.locations) {
    const unitResult = await entityManager.findOne(Unit, {
      name: entry.unitId,
      facId: facilityId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `The database doesn't contain unit ${entry.unitId} for Oris Code ${monPlan.orisCode}`,
      );
    }
  }

  return check;
};

export const Check3 = async (
  monPlan: UpdateMonitorPlanDTO,
): Promise<CheckResult> => {
  const entityManager = getEntityManager();

  const check = new CheckResult(
    'Check3',
    'Stack/Pipe in the File Associated With at Least One Unit (foreach UnitStackConfiguration element)',
  );

  const facilityId = await getFacIdFromOris(monPlan.orisCode);
  for (const entry of monPlan.unitStackConfiguration) {
    const unitResult = await entityManager.findOne(StackPipe, {
      id: entry.stackPipeId,
      facId: facilityId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `Each stack or pipe must be associated with at least one unit. Stack/pipe ${entry.stackPipeId} is not associated with any units.`,
      );
    }
  }

  return check;
};

export const Check4 = async (
  monPlan: UpdateMonitorPlanDTO,
): Promise<CheckResult> => {
  const entityManager = getEntityManager();

  const check = new CheckResult(
    'Check4',
    'Unit in the File Associated With at Least One Stack/Pipe (foreach UnitStackConfiguration element)',
  );

  for (const entry of monPlan.unitStackConfiguration) {
    const unitResult = await entityManager.findOne(UnitStackConfiguration, {
      unitId: entry.unitId,
      stackPipeId: entry.stackPipeId,
    });
    if (unitResult === undefined) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `Each unit must be associated with at least one stack pipe. Unit ${entry.unitId} is not associated with any stack pipes.`,
      );
    }
  }

  return check;
};

export const Check8 = (monPlan: UpdateMonitorPlanDTO): CheckResult => {
  const check = new CheckResult(
    'Check8',
    'Unit Stack Configuration Record Must Be Linked to Unit and Stack/Pipe (foreach UnitStackConfiguration element)',
  );

  const monitorLocationDataStackPipeIds = new Set<string>();
  const monitorLocationDataUnitIds = new Set<number>();
  monPlan.locations.forEach(entry => {
    if (!(entry.stackPipeId === null || entry.stackPipeId === undefined)) {
      monitorLocationDataStackPipeIds.add(entry.stackPipeId);
    }

    if (!(entry.unitId === null || entry.unitId === undefined)) {
      monitorLocationDataUnitIds.add(+entry.unitId);
    }
  });

  const stackPipeIdToUnitId = new Map<string, number>();
  monPlan.unitStackConfiguration.forEach(entry => {
    if (
      stackPipeIdToUnitId.has(entry.stackPipeId) &&
      stackPipeIdToUnitId.get(entry.stackPipeId) === entry.unitId
    ) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `Unit stack configuration records must be unique combinations of StackPipeID and UnitID. The configuration for StackPipeID ${entry.stackPipeId} and Unit ${entry.unitId} has multiple instances.`,
      );
    } else {
      stackPipeIdToUnitId.set(entry.stackPipeId, entry.unitId);
    }

    if (!monitorLocationDataStackPipeIds.has(entry.stackPipeId)) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `Each Stack/Pipe in a unit stack configuration record must be linked to stack/pipe records that are also present in the file. StackPipeID ${entry.stackPipeId} was not associated with a Stack/Pipe record in the file.`,
      );
    }

    if (!monitorLocationDataUnitIds.has(entry.unitId)) {
      check.checkResult = false;
      check.checkErrorMessages.push(
        `Each Unit in a unit stack configuration record must be linked to unit records that are also present in the file. Unit ${entry.unitId} was not associated with a Unit record in the file.`,
      );
    }
  });

  return check;
};

// Function needed to mock the getManager()
export const getEntityManager: any = () => {
  return getManager();
};

export const getFacIdFromOris = async (orisCode: number): Promise<number> => {
  const entityManager = getEntityManager();

  const facResult = await entityManager.findOne(Plant, {
    orisCode: orisCode,
  });

  if (facResult === undefined) {
    return null;
  } else {
    return facResult.id;
  }
};

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
  const FileChecks = [new Check(Check8)];
  const LocationChecks = [new Check(Check1), new Check(Check2)];
  const UnitStackChecks = [new Check(Check3), new Check(Check4)];

  if (monPlan.unitStackConfiguration !== undefined) {
    await runCheckQueue(LocationChecks, monPlan);
    await runCheckQueue(FileChecks, monPlan);
    await runCheckQueue(UnitStackChecks, monPlan);
  } else {
    await runCheckQueue(LocationChecks, monPlan);
  }
};
