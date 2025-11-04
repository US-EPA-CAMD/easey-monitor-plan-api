import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { UserRole } from '@us-epa-camd/easey-common/enums';

jest.mock('./monitor-configurations-workspace.service');
jest.mock('@us-epa-camd/easey-common/guards');

const data: MonitorPlanDTO[] = [new MonitorPlanDTO(), new MonitorPlanDTO()];
const mockArrayResponse: ArrayResponse<MonitorPlanDTO> = {
  items: data,
};

const adminUser: CurrentUser = {
  userId: 'admin',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [UserRole.ADMIN],
};

const nonAdminUser: CurrentUser = {
  userId: 'testuser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [
    { facId: 1, orisCode: 3, permissions: [] },
    { facId: 2, orisCode: 7, permissions: [] },
  ],
  roles: [],
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
      expect(await controller.getAllConfigurations()).toStrictEqual(
        mockArrayResponse,
      );
    });
  });

  describe('getConfigurations', () => {
    it('should allow an Admin user to access any requested facility', async () => {
      const dto = new ConfigurationMultipleParamsDTO();
      dto.orisCodes = [3, 99];
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);

      const result = await controller.getConfigurations(dto, adminUser);

      expect(service.getConfigurations).toHaveBeenCalledWith(dto.orisCodes, dto.monPlanIds);
      expect(result).toStrictEqual({ items: data });
    });

    it('should allow a non-Admin user with correct permissions for all requested facilities', async () => {
      const dto = new ConfigurationMultipleParamsDTO();
      dto.orisCodes = [3, 7];
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);

      const result = await controller.getConfigurations(dto, nonAdminUser);

      expect(service.getConfigurations).toHaveBeenCalledWith(dto.orisCodes, dto.monPlanIds);
      expect(result).toStrictEqual({ items: data });
    });

    it('should throw a ForbiddenException for a non-Admin user requesting a facility without permission', async () => {
      const dto = new ConfigurationMultipleParamsDTO();
      dto.orisCodes = [3, 99];

      await expect(
        controller.getConfigurations(dto, nonAdminUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw a ForbiddenException if any of the requested facilities are not in permission list of the user', async () => {
        const dto = new ConfigurationMultipleParamsDTO();
        dto.orisCodes = [99, 7];
  
        await expect(
          controller.getConfigurations(dto, nonAdminUser),
        ).rejects.toThrow(ForbiddenException);
      });
  });
});
