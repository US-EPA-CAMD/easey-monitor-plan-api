import { EntityManager } from 'typeorm';

import * as utils from '../utilities/utils';
import * as checks from './formula';
import { UpdateMonitorPlanDTO } from '../../dtos/monitor-plan-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorFormula } from '../../entities/workspace/monitor-formula.entity';
import { MonitorFormulaBaseDTO } from '../../dtos/monitor-formula.dto';

describe('Component Tests', () => {
  describe('Check9', () => {
    it('Should pass with formula parameter code matching db parameter code', async () => {
      const form = new MonitorFormula();
      form.parameterCode = 'SO2';

      const mockManager = {
        findOneBy: jest.fn().mockResolvedValue(form),
      };
      jest
        .spyOn(utils, 'getEntityManager')
        .mockReturnValue((mockManager as any) as EntityManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const formula = new MonitorFormulaBaseDTO();

      formula.parameterCode = 'SO2';
      formula.formulaCode = null;

      location.monitoringFormulaData = [formula];
      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check9.executeCheck(testData);

      expect(checkResults.checkResult).toBe(true);
    });

    it('Should fail with formula parameter code not matching db parameter code', async () => {
      const form = new MonitorFormula();
      form.parameterCode = 'ERROR';

      const mockManager = {
        findOneBy: jest.fn().mockResolvedValue(form),
      };
      jest
        .spyOn(utils, 'getEntityManager')
        .mockReturnValue((mockManager as any) as EntityManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const formula = new MonitorFormulaBaseDTO();

      formula.parameterCode = 'SO2';
      formula.formulaCode = null;

      location.monitoringFormulaData = [formula];
      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check9.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });

    it('Should fail with formula code not matching db formula code', async () => {
      const form = new MonitorFormula();
      form.parameterCode = 'SO2';
      form.formulaCode = 'ERROR';

      const mockManager = {
        findOneBy: jest.fn().mockResolvedValue(form),
      };
      jest
        .spyOn(utils, 'getEntityManager')
        .mockReturnValue((mockManager as any) as EntityManager);
      jest.spyOn(utils, 'getFacIdFromOris').mockResolvedValue(1);
      jest.spyOn(utils, 'getMonLocId').mockResolvedValue(new MonitorLocation());

      const location = new UpdateMonitorLocationDTO();
      const formula = new MonitorFormulaBaseDTO();

      formula.parameterCode = 'SO2';
      formula.formulaCode = 'W';

      location.monitoringFormulaData = [formula];
      const testData = new UpdateMonitorPlanDTO();
      testData.monitoringLocationData = [location];

      const checkResults = await checks.Check9.executeCheck(testData);

      expect(checkResults.checkResult).toBe(false);
    });
  });
});
