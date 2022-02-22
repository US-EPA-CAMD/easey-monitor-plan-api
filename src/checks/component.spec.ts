import * as utils from './utilities/utils';
import * as checks from './component';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { UpdateComponentDTO } from '../dtos/component-update.dto';
import { UpdateAnalyzerRangeDTO } from '../dtos/analyzer-range-update.dto';
import { Component } from '../entities/workspace/component.entity';

describe('Component Tests', () => {
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
      const component = new UpdateComponentDTO();
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
      const component = new UpdateComponentDTO();
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
      const component = new UpdateComponentDTO();
      const analyzerRange = new UpdateAnalyzerRangeDTO();
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
