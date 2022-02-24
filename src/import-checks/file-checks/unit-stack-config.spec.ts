import * as utils from '../utilities/utils';
import * as checks from './unit-stack-config';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';

describe('Unit-Stack Tests', () => {
  describe('Check1', () => {
    it('Should error with no corresponding facility id', async () => {
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(null);

      const checkResults = await checks.Check1.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check2', () => {
    it('Should pass given a returned entry for faciliyId and unitId in uniStackConfiguration', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';
      locationData.unitId = '1';

      testData.locations = [locationData];

      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      const checkResults = await checks.Check2.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error given a undefined entry for faciliyId and unitId in uniStackConfiguration', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';
      locationData.unitId = '1';

      testData.locations = [locationData];

      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      const checkResults = await checks.Check2.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
