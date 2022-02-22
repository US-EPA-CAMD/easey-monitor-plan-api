import { Unit } from '../entities/workspace/unit.entity';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { Check, CheckResult } from './utilities/check';
import { getEntityManager, getFacIdFromOris } from './utilities/utils';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

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

    for (const loc of monPlan.locations) {
      let monLoc;
      if (loc.stackPipeId !== null) {
        const stackPipe = await entityManager.findOne(StackPipe, {
          name: loc.stackPipeId,
          facId: facility,
        });
        monLoc = await entityManager.findOne(MonitorLocation, {
          stackPipe: stackPipe.id,
        });
      } else {
        const unit = await entityManager.findOne(Unit, {
          name: loc.unitId,
          facId: facility,
        });
        monLoc = await entityManager.findOne(MonitorLocation, {
          unit: unit.id,
        });
      }

      const invalidTypeCodes = ['LTGS', 'LTOL', 'OILM', 'OILV', 'GAS'];

      for (const system of loc.systems) {
        if (
          system.fuelFlows.length > 0 &&
          invalidTypeCodes.includes(system.systemTypeCode)
        ) {
          result.addError(
            'CRIT1-A',
            'You have reported a System Fuel Flow record for a system that is not a fuel flow system. It is not appropriate to report a System Fuel Flow record for any other SystemTypeCode than OILM, OILV, GAS, LTGS, or LTOL.',
          );
        } else {
          for (const typeCd of invalidTypeCodes) {
            if (
              (await entityManager.findOne(MonitorSystem, {
                locationId: monLoc.id,
                systemTypeCode: typeCd,
              })) !== undefined
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
