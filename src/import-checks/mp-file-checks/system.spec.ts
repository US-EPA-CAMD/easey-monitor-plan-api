import * as utils from '../utilities/utils';
import * as checks from './system';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorSystemBaseDTO } from '../../dtos/monitor-system-update.dto';
import { SystemFuelFlowBaseDTO } from '../../dtos/system-fuel-flow-update.dto';
import { MonitorSystem } from '../../entities/monitor-system.entity';

describe('System Tests', () => {
  describe('Check5', () => {
    it('Should pass with valid dsystem type code and matching db record', async () => {
      const sys = new MonitorSystem();
      sys.systemTypeCode = 'LTGS';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(sys),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new MonitorSystemBaseDTO();
      system.systemTypeCode = 'LTGS';

      system.fuelFlows = [];
      location.systems = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check5.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with systemTypeCode and non-matching db record', async () => {
      const sys = new MonitorSystem();
      sys.systemTypeCode = 'ERROR';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(sys),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new MonitorSystemBaseDTO();
      system.systemTypeCode = 'LTGS';

      system.fuelFlows = [];
      location.systems = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check5.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check31', () => {
    it('Should pass with invalid system type code and no fuel flow data', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new MonitorSystemBaseDTO();
      system.systemTypeCode = 'LTGS';

      system.fuelFlows = [];
      location.systems = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check31.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error with invalid system type code and fuel flow data', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new MonitorSystemBaseDTO();
      system.systemTypeCode = 'LTGS';
      const fuelFlow = new SystemFuelFlowBaseDTO();

      system.fuelFlows = [fuelFlow];
      location.systems = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check31.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should error with valid system type code and matching record found in db with invalid system type code', async () => {
      const sys = new MonitorSystem();
      sys.systemTypeCode = 'LTGS';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(sys),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new MonitorSystemBaseDTO();
      system.systemTypeCode = 'LTGS';

      system.fuelFlows = [];
      location.systems = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check31.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
