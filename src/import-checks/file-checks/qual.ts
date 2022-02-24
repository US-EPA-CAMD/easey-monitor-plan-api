import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { Check, CheckResult } from '../utilities/check';

export const Check11 = new Check(
  {
    checkName: 'Check11',
    checkDescription: 'Identify extraneous values in the MonitorQualLME record',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT11');

    monPlan.locations.forEach(location => {
      location.qualifications.forEach(qual => {
        if (qual.qualificationTypeCode !== 'LMEA') {
          for (let i = 0; i < qual.lmeQualifications.length; i++) {
            if (qual.lmeQualifications[i].so2Tons !== null) {
              result.addError(
                'NONCRIT-A',
                `A value has been reported for SO2Tons for the Monitor Qualification LME record #${i +
                  1}. This field should be blank`,
              );
            }
          }
        }
      });
    });

    return result;
  },
);

export const Check12 = new Check(
  {
    checkName: 'Check12',
    checkDescription:
      'Identify Inappropriate Children Records for Monitor Qualification',
  },
  async (monPlan: UpdateMonitorPlanDTO): Promise<CheckResult> => {
    const result = new CheckResult('IMPORT12');

    monPlan.locations.forEach(location => {
      location.qualifications.forEach(qual => {
        if (
          !['PK', 'SK', 'GF'].includes(qual.qualificationTypeCode) &&
          qual.pctQualifications.length > 0
        ) {
          result.addError(
            'FATAL-A',
            `You have reported a MonitorQualPercent record for a location with the Qualification Type Code not equal to PK, SK or GF. A MonitorQualPercent record should not be reported for qualification Codes other than PK, SK or GF.`,
          );
        }

        if (
          !['LMEA', 'LMES'].includes(qual.qualificationTypeCode) &&
          qual.lmeQualifications.length > 0
        ) {
          result.addError(
            'FATAL-B',
            `You have reported a MonitorQualLME record for a location with the Qualification Type Code not equal to LMEA or LMES. A MonitorQualLME record should not be reported for qualification Codes other than LMEA or LMES.`,
          );
        }
      });
    });

    return result;
  },
);
