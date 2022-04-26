import * as utils from '../utilities/utils';
import * as checks from './component';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { UpdateComponentBaseDTO } from '../../dtos/component.dto';
import { AnalyzerRangeBaseDTO } from '../../dtos/analyzer-range.dto';
import { Component } from '../../entities/workspace/component.entity';

describe('Component Tests', () => {
  describe('Check6', () => {
    it('Should pass with component type code matching db component type code', async () => {
      const comp = new Component();
      comp.componentTypeCode = 'SO2';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(comp),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = null;

      location.components = [component];
      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check6.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should fail with component type code not matching db component type code', async () => {
      const comp = new Component();
      comp.componentTypeCode = 'ERROR';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(comp),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = null;

      location.components = [component];
      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check6.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should fail with basis type code not matching db component basis code', async () => {
      const comp = new Component();
      comp.componentTypeCode = 'SO2';
      comp.basisCode = 'ERROR';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(comp),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = 'W';

      location.components = [component];
      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check6.executeCheck(testData);

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
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = null;

      location.components = [component];
      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check7.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should faill with component not found in database', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();

      component.componentTypeCode = 'SO2';
      component.basisCode = null;

      location.components = [component];
      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check7.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });

  describe('Check32', () => {
    it('Should fail with invalid component type code and analyzer range data', async () => {
      const comp = new Component();
      comp.componentTypeCode = 'SO2';

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(comp),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();
      component.componentTypeCode = 'TEST';
      component.analyzerRanges = [];
      location.components = [component];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check32.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should pass with invalid component type code and no analyzer range data', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();
      component.componentTypeCode = 'SO2';
      component.analyzerRanges = [];
      location.components = [component];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check32.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should fail with invalid component type code and analyzer range data', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const component = new UpdateComponentBaseDTO();
      const analyzerRange = new AnalyzerRangeBaseDTO();
      component.componentTypeCode = 'SO2';
      component.analyzerRanges = [analyzerRange];
      location.components = [component];

      const testData = new UpdateMonitorPlanDTO();
      testData.locations = [location];

      const checkResults = await checks.Check32.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
