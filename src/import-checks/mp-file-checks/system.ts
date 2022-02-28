import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from '../utilities/check';
import {
  getEntityManager,
  getFacIdFromOris,
  getMonLocId,
} from '../utilities/utils';
import { MonitorSystem } from '../../entities/workspace/monitor-system.entity';

export const Check5 = new Check(
  {
    checkName: 'Check5',
    checkDescription:
      'Each system (ORIS Code + UnitStackPipe ID + Monitoring System ID) in the file that is also in the Workspace schema system table must have the same System Type',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT5');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    for (const loc of monPlan.locations) {
      const monLoc = await getMonLocId(loc, facility);

      for (const system of loc.systems) {
        const Sys = await entityManager.findOne(MonitorSystem, {
          locationId: monLoc.id,
          monitoringSystemId: system.monitoringSystemId,
        });

        if (Sys !== undefined && Sys.systemTypeCode !== system.systemTypeCode) {
          result.addError(
            'CRIT1-A',
            `The system type ${system.systemTypeCode} for UnitStackPipeID ${loc.unitId}/${loc.stackPipeId} and MonitoringSystemID ${system.monitoringSystemId} does not match the system type in the Workspace database.`,
          );
        }
      }

      return result;
    }
  },
);

export const Check31 = new Check(
  {
    checkName: 'Check31',
    checkDescription:
      'Identify situations where a System FuelFlow record has been reported for a non-fuel flow system.',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT31');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    const invalidTypeCodes = ['LTGS', 'LTOL', 'OILM', 'OILV', 'GAS'];

    for (const loc of monPlan.locations) {
      const monLoc = await getMonLocId(loc, facility);

      for (const system of loc.systems) {
        if (system.fuelFlows.length > 0) {
          if (invalidTypeCodes.includes(system.systemTypeCode)) {
            result.addError(
              'CRIT1-A',
              'You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
            );
          } else {
            const Sys = await entityManager.findOne(MonitorSystem, {
              locationId: monLoc.id,
              monitoringSystemId: system.monitoringSystemId,
            });

            if (
              Sys !== undefined &&
              invalidTypeCodes.includes(Sys.systemTypeCode)
            ) {
              result.addError(
                'CRIT1-A',
                'You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
              );
            }
          }
        }
      }

      return result;
    }
  },
);
