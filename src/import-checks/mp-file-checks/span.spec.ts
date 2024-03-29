import * as checks from './span';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorSpanBaseDTO } from '../../dtos/monitor-span.dto';

describe('Span Tests', () => {
  describe('Check10', () => {
    it('Should pass when proper values are set for all fields', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const span = new MonitorSpanBaseDTO();

      span.componentTypeCode = 'FLOW';
      span.mpcValue = null;
      span.mecValue = null;
      span.defaultHighRange = null;
      span.scaleTransitionPoint = null;
      span.spanScaleCode = null;

      locations.monitoringSpanData = [span];
      testData.monitoringLocationData = [locations];

      const checkResults = await checks.Check10.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should error invalid non null field when componentTypeCode is FLOW', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const span = new MonitorSpanBaseDTO();

      span.componentTypeCode = 'FLOW';
      span.mpcValue = 5;

      locations.monitoringSpanData = [span];
      testData.monitoringLocationData = [locations];

      const checkResults = await checks.Check10.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should error invalid non null field when componentTypeCode is not FLOW', async () => {
      const testData = new UpdateMonitorPlanDTO();

      const locations = new UpdateMonitorLocationDTO();
      const span = new MonitorSpanBaseDTO();

      span.componentTypeCode = 'FLOW';
      span.mecValue = 5;

      locations.monitoringSpanData = [span];
      testData.monitoringLocationData = [locations];

      const checkResults = await checks.Check10.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
