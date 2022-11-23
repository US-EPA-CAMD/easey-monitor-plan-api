import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';

jest.mock('./monitor-configurations-workspace.service');

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

describe('MonitorConfigurations', () => {
  let controller: MonitorConfigurationsWorkspaceController;
  let service: MonitorConfigurationsWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [MonitorConfigurationsWorkspaceController],
      providers: [MonitorConfigurationsWorkspaceService],
    }).compile();

    controller = module.get(MonitorConfigurationsWorkspaceController);
    service = module.get(MonitorConfigurationsWorkspaceService);
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
});
