import { UpdateComponentBaseDTO } from '../../dtos/component.dto';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { UpdateMonitorSystemDTO } from '../../dtos/monitor-system.dto';
import { SystemComponentBaseDTO } from '../../dtos/system-component.dto';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import * as utils from './utils';

describe('Monitor-Import Utilities Tests', () => {
  describe('getMonLocId', () => {
    it('Should return new location entity given a location record with stackPipeId', async () => {
      const expected = new MonitorLocation();

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(expected),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const loc = new UpdateMonitorLocationDTO();
      loc.stackPipeId = 'TEST';
      loc.unitId = null;

      const checkResult = await utils.getMonLocId(loc, 1, 1);

      expect(checkResult).toBe(expected);
    });

    it('Should return new location entity given a location record with unitId', async () => {
      const expected = new MonitorLocation();

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(expected),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const loc = new UpdateMonitorLocationDTO();
      loc.unitId = '1';
      loc.stackPipeId = null;

      const checkResult = await utils.getMonLocId(loc, 1, 1);

      expect(checkResult).toBe(expected);
    });
  });

  describe('getFacIdFromOris', () => {
    it('Should return null given invalid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await utils.getFacIdFromOris(3);

      expect(checkResult).toBe(null);
    });

    it('Should return facilityId given valid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await utils.getFacIdFromOris(1);

      expect(checkResult).toBe(1);
    });
  });

  describe('checkComponentExistanceInFile', () => {
    it('Should return true when component exists in monitor plan import file data', async () => {
      jest.spyOn(utils, 'checkComponentExistanceInFile').mockReturnValue(true);

      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.componentId = 'AA0';

      systemComponent.componentTypeCode = 'S02';
      systemComponent.componentId = 'AA0';

      system.monitoringSystemComponentData = [systemComponent];

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResult = await utils.checkComponentExistanceInFile(
        testData,
        systemComponent,
      );

      expect(checkResult).toBe(true);
    });

    it('Should return false when component does not exists in monitor plan import file data', async () => {
      jest.spyOn(utils, 'checkComponentExistanceInFile').mockReturnValue(false);

      const location = new UpdateMonitorLocationDTO();
      const system = new UpdateMonitorSystemDTO();
      const systemComponent = new SystemComponentBaseDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.componentId = 'AA0';

      systemComponent.componentTypeCode = 'S20';
      systemComponent.componentId = 'AA00';

      system.monitoringSystemComponentData = [systemComponent];

      location.componentData = [component];
      location.monitoringSystemData = [system];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResult = await utils.checkComponentExistanceInFile(
        testData,
        systemComponent,
      );

      expect(checkResult).toBe(false);
    });
  });
});
