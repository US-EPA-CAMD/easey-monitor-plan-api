import * as checks from './qual';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { UpdateMonitorQualificationDTO } from '../../dtos/monitor-qualification.dto';
import { LMEQualificationBaseDTO } from '../../dtos/lme-qualification.dto';
import { PCTQualificationBaseDTO } from '../../dtos/pct-qualification.dto';

describe('Span Tests', () => {
  describe('Check11', () => {
    it('Should pass when values for qualTypeCode of qualfication is valid with so2 value not set', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQuals = new LMEQualificationBaseDTO();

      lmeQuals.so2Tons = null;
      quals.qualificationTypeCode = 'LME';
      quals.lmeQualifications = [lmeQuals];
      locations.qualifications = [quals];
      testData.locations = [locations];

      const checkResults = await checks.Check11.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should fail when values for qualTypeCode of qualfication is not valid with so2 value set', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQuals = new LMEQualificationBaseDTO();

      lmeQuals.so2Tons = 5;
      quals.qualificationTypeCode = 'LME';
      quals.lmeQualifications = [lmeQuals];
      locations.qualifications = [quals];
      testData.locations = [locations];

      const checkResults = await checks.Check11.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check12', () => {
    it('Should pass when type code is not LMEA, LMES and qual lme count is 0', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();

      quals.qualificationTypeCode = 'LME';
      quals.lmeQualifications = [];
      quals.pctQualifications = [];
      locations.qualifications = [quals];
      testData.locations = [locations];

      const checkResults = await checks.Check12.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should fail when type code is not PK, SK, GF and qual percent has a count greater than 0', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();
      const pctQuals = new PCTQualificationBaseDTO();

      quals.qualificationTypeCode = 'LME';
      quals.lmeQualifications = [];
      quals.pctQualifications = [pctQuals];
      locations.qualifications = [quals];
      testData.locations = [locations];

      const checkResults = await checks.Check12.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should fail when type code is not LMEA, LMES and qual lme has a count greater than 0', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQuals = new LMEQualificationBaseDTO();

      quals.qualificationTypeCode = 'LME';
      quals.lmeQualifications = [lmeQuals];
      quals.pctQualifications = [];
      locations.qualifications = [quals];
      testData.locations = [locations];

      const checkResults = await checks.Check12.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
