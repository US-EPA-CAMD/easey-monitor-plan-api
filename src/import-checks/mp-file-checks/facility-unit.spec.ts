import * as utils from '../utilities/utils';
import * as checks from './facility-unit';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';

describe('Facility-Unit Tests', () => {
  describe('Check3', () => {
    it('Should pass with valid unitId and stackId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check3.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with valid unitId and stackId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check3.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check4', () => {
    it('Should pass with valid unitId and facilityId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check4.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with invalid unitId and facilityId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check4.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check8', () => {
    it('Should pass with valid input', async () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';
      locationData.unitId = '1';

      testData.locations = [locationData];

      const checkResults = await checks.Check8.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with one given duplicate unitId and stackPipeId', async () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';
      locationData.unitId = '1';
      testData.locations = [locationData];

      const checkResults = await checks.Check8.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should error with no matching stackPipeID in location and configuration data', async () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'testError';
      locationData.unitId = '1';
      testData.locations = [locationData];

      const checkResults = await checks.Check8.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should error with no matching unitId in location and configuration data', async () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';
      locationData.unitId = '2';
      testData.locations = [locationData];

      const checkResults = await checks.Check8.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
