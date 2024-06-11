import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from '../utilities/check';
import {
  checkComponentExistanceInFile,
  getEntityManager,
  getFacIdFromOris,
  getMonLocId,
} from '../utilities/utils';
import { MonitorSystem } from '../../entities/workspace/monitor-system.entity';
import { Component } from '../../entities/workspace/component.entity';

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

    for (const loc of monPlan.monitoringLocationData) {
      const monLoc = await getMonLocId(loc, facility, monPlan.orisCode);

      for (const system of loc.monitoringSystemData) {
        const sys = await entityManager.findOneBy(MonitorSystem, {
          locationId: monLoc.id,
          monitoringSystemId: system.monitoringSystemId,
        });

        if (sys && sys.systemTypeCode !== system.systemTypeCode) {
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

export const Check7 = new Check(
  {
    checkName: 'Check7',
    checkDescription:
      'Component in the System Component Record Present in Workspace Component Table. Each component in the system component table must be a component in the component table.',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT7');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    for (const loc of monPlan.monitoringLocationData) {
      const monLoc = await getMonLocId(loc, facility, monPlan.orisCode);

      for (const system of loc.monitoringSystemData) {
        for (const systemComponent of system.monitoringSystemComponentData) {
          const comp = await entityManager.findOneBy(Component, {
            locationId: monLoc.id,
            componentId: systemComponent.componentId,
          });

          let checkComponentExists;

          if (!comp) {
            checkComponentExists = checkComponentExistanceInFile(
              monPlan,
              systemComponent,
            );
          }

          if (!comp && checkComponentExists === false) {
            result.addError(
              'CRIT1-A',
              `The workspace database and Monitor Plan Import File does not contain a Component record for ${systemComponent.componentId}`,
            );
          }
        }
      }
    }
    return result;
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

    const validTypeCodes = ['LTGS', 'LTOL', 'OILM', 'OILV', 'GAS'];

    for (const loc of monPlan.monitoringLocationData) {
      const monLoc = await getMonLocId(loc, facility, monPlan.orisCode);

      for (const system of loc.monitoringSystemData) {
        if (system.monitoringSystemFuelFlowData.length > 0) {
          if (!validTypeCodes.includes(system.systemTypeCode)) {
            result.addError(
              'CRIT1-A',
              'You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
            );
          } else {
            const sys = await entityManager.findOneBy(MonitorSystem, {
              locationId: monLoc.id,
              monitoringSystemId: system.monitoringSystemId,
            });

            if (sys && !validTypeCodes.includes(sys.systemTypeCode)) {
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
