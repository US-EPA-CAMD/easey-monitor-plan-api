import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { Check, CheckResult } from '../utilities/check';

export const Check10 = new Check(
  {
    checkName: 'Check10',
    checkDescription: 'Identify extraneous values in the span record.',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT10');

    monPlan.locations.forEach(location => {
      location.monitoringSpanData.forEach(span => {
        let mustBeNull;
        if (span.componentTypeCode === 'FLOW') {
          mustBeNull = [
            'mpcValue',
            'mecValue',
            'defaultHighRange',
            'scaleTransitionPoint',
            'spanScaleCode',
          ];
        } else {
          mustBeNull = ['mpfValue', 'flowSpanValue', 'flowFullScaleRange'];
        }

        mustBeNull.forEach(category => {
          if (span[category] !== null) {
            result.addError(
              'NONCRIT-A',
              `An extraneous value has been reported for ${category} in the span record for ${span.componentTypeCode}`,
            );
          }
        });
      });
    });

    return result;
  },
);
