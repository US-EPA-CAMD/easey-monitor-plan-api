import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import * as checks from './import-checks';

describe('Monitor-Import Utilities Tests', () => {
  describe('getFacIdFromOris', () => {
    it('Should return null given invalid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await checks.getFacIdFromOris(3);

      expect(checkResult).toBe(null);
    });

    it('Should return facilityId given valid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await checks.getFacIdFromOris(1);

      expect(checkResult).toBe(1);
    });
  });
});

describe('Monitor-Import File Check Tests', () => {
  describe('Check3', () => {
    it('Should error with two error messages given invalid unitId and stackPipeId', () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: null,
          stackPipeId: null,
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = checks.Check3(testData);

      expect(checkResults.checkResult).toBe(false);
      expect(checkResults.checkErrorMessages.length).toBe(2);
    });

    it('Should error with one error messages given duplicate unitId and stackPipeId', () => {
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

      const checkResults = checks.Check3(testData);

      expect(checkResults.checkResult).toBe(false);
      expect(checkResults.checkErrorMessages.length).toBe(1);
    });

    it('Should pass with valid input', () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = checks.Check3(testData);

      expect(checkResults.checkResult).toBe(true);
    });
  });

  describe('Check4', () => {
    it('Should error with no matching stackPipeID in location and configuration data', () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: null,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'testFail';

      testData.locations = [locationData];

      const checkResults = checks.Check4(testData);

      expect(checkResults.checkResult).toBe(false);
      expect(checkResults.checkErrorMessages.length).toBe(1);
    });

    it('Should pass with matching stackPipeID in location and configuration data', () => {
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: null,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const locationData = new UpdateMonitorLocationDTO();
      locationData.stackPipeId = 'test';

      testData.locations = [locationData];

      const checkResults = checks.Check4(testData);

      expect(checkResults.checkResult).toBe(true);
    });
  });

  describe('Check8', () => {
    it('Should error with no matching unitId in location and configuration data', () => {
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
      locationData.unitId = '2';

      testData.locations = [locationData];

      const checkResults = checks.Check8(testData);

      expect(checkResults.checkResult).toBe(false);
      expect(checkResults.checkErrorMessages.length).toBe(1);
    });

    it('Should pass with matching unitId in location and configuration data', () => {
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
      locationData.unitId = '1';

      testData.locations = [locationData];

      const checkResults = checks.Check8(testData);

      expect(checkResults.checkResult).toBe(true);
    });
  });
});

describe('Monitor-Import Database Check Tests', () => {
  describe('Check1', () => {
    it('Should pass with corresponding facility id', async () => {
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(null);

      const checkResults = await checks.Check1(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check2A', () => {
    it('Should pass given a returned entry for faciliyId and unitId in uniStackConfiguration', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      const checkResults = await checks.Check2A(
        testData,
        'unitStackConfiguration',
      );

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error given a undefined entry for faciliyId and unitId in uniStackConfiguration', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      const checkResults = await checks.Check2A(
        testData,
        'unitStackConfiguration',
      );

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check2B', () => {
    it('Should pass with valid unitId and facilityId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check2B(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with invalid unitId and facilityId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check2B(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check2C', () => {
    it('Should pass with valid unitId and stackId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check2C(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with valid unitId and stackId', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(checks, 'getEntityManager').mockReturnValue(mockManager);
      const testData = new UpdateMonitorPlanDTO();
      jest.spyOn(checks, 'getFacIdFromOris').mockResolvedValue(1);

      testData.unitStackConfiguration = [
        {
          unitId: 1,
          stackPipeId: 'test',
          beginDate: new Date(),
          endDate: new Date(),
        },
      ];

      const checkResults = await checks.Check2C(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
