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
        name: entry.stackName,
        facId: facilityId,
      });
      if (unitResult === undefined) {
        result.addError(
          'FATAL-A',
          `Each stack or pipe must be associated with at least one unit. StackName ${entry.stackPipeId} is not associated with any units.`,
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
    const monitorLocationDataUnitIds = new Set<string>();
    monPlan.locations.forEach(entry => {
      if (!(entry.stackPipeId === null || entry.stackPipeId === undefined)) {
        monitorLocationDataStackPipeIds.add(entry.stackPipeId);
      }

      if (!(entry.unitId === null || entry.unitId === undefined)) {
        monitorLocationDataUnitIds.add(entry.unitId);
      }
    });

    const stackPipeIdToUnitId = new Map<string, string>();
    monPlan.unitStackConfiguration.forEach(entry => {
      if (
        stackPipeIdToUnitId.has(entry.stackName) &&
        stackPipeIdToUnitId.get(entry.stackName) === entry.unitName
      ) {
        result.addError(
          'CRIT1-A',
          `Unit stack configuration records must be unique combinations of StackPipeID and UnitID. The configuration for StackName ${entry.stackName} and Unit ${entry.unitName} has multiple instances.`,
        );
      } else {
        stackPipeIdToUnitId.set(entry.stackName, entry.unitName);
      }

      if (!monitorLocationDataStackPipeIds.has(entry.stackName)) {
        result.addError(
          'CRIT1-B',
          `Each Stack/Pipe in a unit stack configuration record must be linked to stack/pipe records that are also present in the file. StackName ${entry.stackName} was not associated with a Stack/Pipe record in the file.`,
        );
      }

      if (!monitorLocationDataUnitIds.has(entry.unitName)) {
        result.addError(
          'CRIT1-B',
          `Each Unit in a unit stack configuration record must be linked to unit records that are also present in the file. Unit ${entry.unitName} was not associated with a Unit record in the file.`,
        );
      }
    });

    return result;
  },
);
