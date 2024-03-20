import * as utils from '../utilities/utils';
import * as checks from './system';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorSystem } from '../../entities/monitor-system.entity';
import { Component } from '../../entities/workspace/component.entity';
import { UpdateComponentBaseDTO } from '../../dtos/component.dto';
import { UpdateMonitorSystemDTO } from '../../dtos/monitor-system.dto';
import { SystemFuelFlowBaseDTO } from '../../dtos/system-fuel-flow.dto';
import { SystemComponentBaseDTO } from '../../dtos/system-component.dto';

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
      const system = new UpdateMonitorSystemDTO();
      system.systemTypeCode = 'LTGS';

      system.monitoringSystemFuelFlowData = [];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

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
      const system = new UpdateMonitorSystemDTO();
      system.systemTypeCode = 'LTGS';

      system.monitoringSystemFuelFlowData = [];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check5.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check7', () => {
    it('Should pass with component found in database', async () => {
      const comp = new Component();

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(comp),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check7.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should pass with component if not found in database but exists in monitor plan import file', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());
      jest.spyOn(utils, 'checkComponentExistanceInFile').mockReturnValue(true);

      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check7.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should faill with component not found in database and in the monitor plan import file', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());
      jest.spyOn(utils, 'checkComponentExistanceInFile').mockReturnValue(false);

      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check7.executeCheck(testData);

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
      const system = new UpdateMonitorSystemDTO();
      system.systemTypeCode = 'LTGS';

      system.monitoringSystemFuelFlowData = [];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

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
      const system = new UpdateMonitorSystemDTO();
      system.systemTypeCode = 'LTGSS';
      const fuelFlow = new SystemFuelFlowBaseDTO();

      system.monitoringSystemFuelFlowData = [fuelFlow];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check31.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    // TODO: Commented Failing Unit Tests, unable to mock Entitymanager.
    // it('Should error with valid system type code and matching record found in db with invalid system type code', async () => {
    //   const sys = new MonitorSystem();
    //   sys.systemTypeCode = 'LTGSS';

    //   const mockManager = {
    //     findOne: jest.fn().mockResolvedValue(sys),
    //   };
    //   jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
    //   jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
    //   jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

    //   const location = new UpdateMonitorLocationDTO();
    //   const system = new MonitorSystemBaseDTO();
    //   system.systemTypeCode = 'LTGS';

    //   system.fuelFlows = [];
    //   location.systems = [system];

    //   const testData = new UpdateMonitorPlanDTO();
    //   testData.locations = [location];

    //   const checkResults = await checks.Check31.executeCheck(testData);

    //   expect(checkResults.checkResult).toBe(false);
    // });
  });
});
