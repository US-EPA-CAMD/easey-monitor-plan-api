import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { Unit } from '../entities/unit.entity';
import { Check, CheckResult } from './utilities/check';
import { getEntityManager, getFacIdFromOris } from './utilities/utils';

export const Check1 = new Check(
  {
    checkName: 'Check1',
    checkDescription:
      'MP Facility Present in the Production Facility Table Facility (ORIS Code) must be present in the database',
  },
  async (monPlan: UpdateMonitorPlanDTO) => {
    const result = new CheckResult('IMPORT1');

    if ((await getFacIdFromOris(monPlan.orisCode)) === null) {
      result.addError(
        'FATAL-A',
        `The database doesn't contain any Facility with Oris Code ${monPlan.orisCode}`,
      );
    }

    return result;
  },
);

export const Check2 = new Check(
  {
    checkName: 'Check2',
    checkDescription:
      'Unit/Stack Present in the Production Unit Table and associated to the import facility',
  },
  async (monPlan: UpdateMonitorPlanDTO) => {
    const entityManager = getEntityManager();

    const result = new CheckResult('IMPORT2');

    const facilityId = await getFacIdFromOris(monPlan.orisCode);
    for (const entry of monPlan.locations) {
      if (entry.unitId !== null) {
        const unitResult = await entityManager.findOne(Unit, {
          name: entry.unitId,
          facId: facilityId,
        });
        if (unitResult === undefined) {
          result.addError(
            'FATAL-A',
            `The database doesn't contain unit ${entry.unitId} for Oris Code ${monPlan.orisCode}`,
          );
        }
      }
    }

    return result;
  },
);
