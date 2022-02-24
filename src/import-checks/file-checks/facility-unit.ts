import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { StackPipe } from '../../entities/stack-pipe.entity';
import { UnitStackConfiguration } from '../../entities/unit-stack-configuration.entity';
import { Check, CheckResult } from '../utilities/check';
import { getEntityManager, getFacIdFromOris } from '../utilities/utils';

export const Check3 = new Check(
  {
    checkName: 'Check3',
    checkDescription:
      'Stack/Pipe in the File Associated With at Least One Unit (foreach UnitStackConfiguration element)',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const entityManager = getEntityManager();

    const result = new CheckResult('IMPORT3');

    const facilityId = await getFacIdFromOris(monPlan.orisCode);
    for (const entry of monPlan.unitStackConfiguration) {
      const unitResult = await entityManager.findOne(StackPipe, {
        id: entry.stackPipeId,
        facId: facilityId,
      });
      if (unitResult === undefined) {
        result.addError(
          'FATAL-A',
          `Each stack or pipe must be associated with at least one unit. Stack/pipe ${entry.stackPipeId} is not associated with any units.`,
        );
      }
    }

    return result;
  },
);

export const Check4 = new Check(
  {
    checkName: 'Check4',
    checkDescription:
      'Unit in the File Associated With at Least One Stack/Pipe (foreach UnitStackConfiguration element)',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const entityManager = getEntityManager();

    const result = new CheckResult('IMPORT4');

    for (const entry of monPlan.unitStackConfiguration) {
      const unitResult = await entityManager.findOne(UnitStackConfiguration, {
        unitId: entry.unitId,
        stackPipeId: entry.stackPipeId,
      });
      if (unitResult === undefined) {
        result.addError(
          'FATAL-A',
          `Each unit must be associated with at least one stack pipe. Unit ${entry.unitId} is not associated with any stack pipes.`,
        );
      }
    }

    return result;
  },
);

export const Check8 = new Check(
  {
    checkName: 'Check8',
    checkDescription:
      'Unit Stack Configuration Record Must Be Linked to Unit and Stack/Pipe (foreach UnitStackConfiguration element)',
  },
  (monPlan: UpdateMonitorPlanDTO): CheckResult => {
    const result = new CheckResult('IMPORT8');

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
        result.addError(
          'CRIT1-A',
          `Unit stack configuration records must be unique combinations of StackPipeID and UnitID. The configuration for StackPipeID ${entry.stackPipeId} and Unit ${entry.unitId} has multiple instances.`,
        );
      } else {
        stackPipeIdToUnitId.set(entry.stackPipeId, entry.unitId);
      }

      if (!monitorLocationDataStackPipeIds.has(entry.stackPipeId)) {
        result.addError(
          'CRIT1-B',
          `Each Stack/Pipe in a unit stack configuration record must be linked to stack/pipe records that are also present in the file. StackPipeID ${entry.stackPipeId} was not associated with a Stack/Pipe record in the file.`,
        );
      }

      if (!monitorLocationDataUnitIds.has(entry.unitId)) {
        result.addError(
          'CRIT1-B',
          `Each Unit in a unit stack configuration record must be linked to unit records that are also present in the file. Unit ${entry.unitId} was not associated with a Unit record in the file.`,
        );
      }
    });

    return result;
  },
);
