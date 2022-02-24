import * as checks from './qual';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateMonitorQualificationDTO } from '../dtos/monitor-qualification-update.dto';
import { UpdateLMEQualificationDTO } from '../dtos/lme-qualification-update.dto';
import { UpdatePCTQualificationDTO } from '../dtos/pct-qualification-update.dto';

describe('Span Tests', () => {
  describe('Check11', () => {
    it('Should pass when values for qualTypeCode of qualfication is valid with so2 value not set', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const quals = new UpdateMonitorQualificationDTO();
      const lmeQuals = new UpdateLMEQualificationDTO();

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
      const lmeQuals = new UpdateLMEQualificationDTO();

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
      const pctQuals = new UpdatePCTQualificationDTO();

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
      const lmeQuals = new UpdateLMEQualificationDTO();

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
