import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from './utilities/check';
import {
  getEntityManager,
  getFacIdFromOris,
  getMonLocId,
} from './utilities/utils';
import { Component } from '../entities/component.entity';

export const Check6 = new Check(
  {
    checkName: 'Check6',
    checkDescription:
      'Each component (ORIS Code + UnitStackPipe ID + Component ID) in the file that is also in the Workspace schema component table must have the same Component Type',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT6');

    const entityManager = getEntityManager();
    const facility = await getFacIdFromOris(monPlan.orisCode);

    for (const loc of monPlan.locations) {
      const monLoc = await getMonLocId(loc, facility);

      for (const component of loc.components) {
        const Comp = await entityManager.findOne(Component, {
          locationId: monLoc.id,
          componentId: component.componentId,
        });

        if (
          Comp !== undefined &&
          Comp.componentTypeCode !== component.componentTypeCode
        ) {
          result.addError(
            'CRIT1-A',
            `The component type ${component.componentTypeCode} for ComponentID ${component.componentId} in UnitStackPipeID ${loc.unitId}/${loc.stackPipeId} does not match the component type in the Workspace database.`,
          );
        }

        if (
          Comp !== undefined &&
          component.basisCode !== null &&
          Comp.basisCode !== component.basisCode
        ) {
          result.addError(
            'CRIT1-B',
            `The moisture basis ${component.basisCode} for ComponentID ${component.componentId} in UnitStackPipeID ${loc.unitId}/${loc.stackPipeId} does not match the moisture basis in the Workspace database.`,
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

    for (const loc of monPlan.locations) {
      const monLoc = await getMonLocId(loc, facility);

      for (const component of loc.components) {
        const Comp = await entityManager.findOne(Component, {
          locationId: monLoc.id,
          componentId: component.componentId,
        });

        if (Comp === undefined) {
          result.addError(
            'CRIT1-A',
            `The workspace database does not contain a Component record for ${component.componentId}`,
          );
        }
      }

      return result;
    }
  },
);

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
