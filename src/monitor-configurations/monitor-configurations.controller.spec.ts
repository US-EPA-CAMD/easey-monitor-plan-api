import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';

jest.mock('./monitor-configurations.service');

const orisCode = null;

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

describe('MonitorConfigurations', () => {
  let controller: MonitorConfigurationsController;
  let service: MonitorConfigurationsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorConfigurationsController],
      providers: [MonitorConfigurationsService],
    }).compile();

    controller = module.get(MonitorConfigurationsController);
    service = module.get(MonitorConfigurationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfigurations', () => {
    it('should return array of monitor plan configurations', async () => {
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);
      const dto = new ConfigurationMultipleParamsDTO();
      expect(await controller.getConfigurations(dto)).toBe(data);
    });
  });

  describe('configuration/last-updated', () => {
    it('should return array of monitor plan configurations and a most recent update time', async () => {
      const dto = new LastUpdatedConfigDTO();

      jest
        .spyOn(service, 'getConfigurationsByLastUpdated')
        .mockResolvedValue(dto);
      expect(await controller.getLastUpdated(new Date())).toBe(dto);
    });
  });
});
