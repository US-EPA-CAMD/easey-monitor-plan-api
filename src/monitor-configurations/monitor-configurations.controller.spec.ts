import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { validate } from 'class-validator';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO, LastUpdatedConfigQueryDTO } from '../dtos/last-updated-config.dto';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';
import { ConfigService } from '@nestjs/config';

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
      providers: [MonitorConfigurationsService, ConfigService],
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
      expect(await controller.getConfigurations(dto)).toStrictEqual({ items: data });
    });
  });

  describe('configuration/last-updated', () => {
    it('should return array of monitor plan configurations and a most recent update time', async () => {
      const dto = new LastUpdatedConfigDTO();

      jest
        .spyOn(service, 'getConfigurationsByLastUpdated')
        .mockResolvedValue(dto);
      expect(await controller.getLastUpdated({ date: '2025-08-05' })).toBe(dto);
    });

    it('should reject dates more than 1 year old', async () => {
      const dto = new LastUpdatedConfigQueryDTO();
      dto.date = '2020-01-01';
      const errors = await validate(dto);
      expect(errors[0].constraints).toEqual({
        IsValidDateWithinLastYear: 'date must be within the last year'
      });
    });
  });
});
