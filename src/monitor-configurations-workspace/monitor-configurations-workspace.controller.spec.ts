import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

jest.mock('./monitor-configurations-workspace.service');

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

const mockArrayResponse: ArrayResponse<MonitorPlanDTO> = {
  items: data,
};

describe('MonitorConfigurations', () => {
  let controller: MonitorConfigurationsWorkspaceController;
  let service: MonitorConfigurationsWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [MonitorConfigurationsWorkspaceController],
      providers: [
        MonitorConfigurationsWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(MonitorConfigurationsWorkspaceController);
    service = module.get(MonitorConfigurationsWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllConfigurations', () => {
    it('should return array of all monitor plan configurations', async () => {
      jest.spyOn(service, 'getAllConfigurations').mockResolvedValue(data);
      expect(await controller.getAllConfigurations()).toStrictEqual(mockArrayResponse);
    });
  });

  describe('getConfigurations', () => {
    it('should return array of monitor plan configurations', async () => {
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);
      const dto = new ConfigurationMultipleParamsDTO();
      expect(await controller.getConfigurations(dto)).toStrictEqual({ items: data});
    });
  });
});
