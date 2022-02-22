import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from './utilities/check';
import {
  getEntityManager,
  getFacIdFromOris,
  getMonLocId,
} from './utilities/utils';
import { Component } from '../entities/component.entity';

export const Check32 = new Check(
  {
    checkName: 'Check32',
    checkDescription:
      'Identify situations where an Analyzer Range record has been reported for an inappropriate',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT32');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    const invalidTypeCodes = ['SO2', 'NOX', 'CO2', 'O2', 'HG', 'HCL', 'HF'];

    for (const loc of monPlan.locations) {
      const monLoc = await getMonLocId(loc, facility);

      for (const component of loc.components) {
        if (
          component.analyzerRanges.length > 0 &&
          invalidTypeCodes.includes(component.componentTypeCode)
        ) {
          result.addError(
            'CRIT1-A',
            'You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.',
          );
        } else {
          const Comp = await entityManager.findOne(Component, {
            locationId: monLoc.id,
            componentId: component.componentId,
          });

          if (
            Comp !== undefined &&
            invalidTypeCodes.includes(Comp.componentTypeCode)
          ) {
            result.addError(
              'CRIT1-A',
              'You have reported an AnalyzerRange record for a component with an inappropriate ComponentTypeCode.',
            );
          }
        }
      }

      return result;
    }
  },
);
