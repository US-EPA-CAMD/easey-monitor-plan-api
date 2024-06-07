import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from '../utilities/check';
import {
  getEntityManager,
  getFacIdFromOris,
  getMonLocId,
} from '../utilities/utils';
import { MonitorFormula } from '../../entities/workspace/monitor-formula.entity';

export const Check9 = new Check(
  {
    checkName: 'Check9',
    checkDescription: 'Formula Parameter and Code Consistency Check',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT9');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    for (const loc of monPlan.monitoringLocationData) {
      const monLoc = await getMonLocId(loc, facility, monPlan.orisCode);

      for (const formula of loc.monitoringFormulaData) {
        const form = await entityManager.findOneBy(MonitorFormula, {
          locationId: monLoc.id,
          formulaId: formula.formulaId,
        });

        if (form && form.parameterCode !== formula.parameterCode) {
          result.addError(
            'CRIT1-A',
            `The ParameterCode ${formula.parameterCode} for UnitStackPipeID ${loc.unitId}/${loc.stackPipeId} and FormulaID ${formula.formulaId} does not match the parameter code in the Workspace database.`,
          );
        }

        if (
          form !== null &&
          formula.formulaCode !== null &&
          form.formulaCode !== formula.formulaCode
        ) {
          result.addError(
            'CRIT1-B',
            `The FormulaCode ${formula.formulaCode} for UnitStackPipeID ${loc.unitId}/${loc.stackPipeId} and FormulaID ${formula.formulaId} does not match the formula code in the Workspace database.`,
          );
        }
      }

      return result;
    }
  },
);
