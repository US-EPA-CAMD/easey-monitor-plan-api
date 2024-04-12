import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethodChecksService } from './mats-method-checks.service';
import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';

const locationId = 'string';
const methodId = 'string';
const matsMethodPayload: MatsMethodBaseDTO = {
  supplementalMATSMonitoringMethodCode: 'string',
  supplementalMATSParameterCode: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const mockMatsMethodWorkspaceService = () => ({
  getMethods: jest.fn(() => []),
  getMethod: jest.fn(() => ({})),
  createMethod: jest.fn(() => ({})),
  updateMethod: jest.fn(() => ({})),
});

const mockCheckService = () => ({
  runChecks: jest.fn(),
});

describe('MatsMethodWorkspaceController', () => {
  let controller: MatsMethodWorkspaceController;
  let service: MatsMethodWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MatsMethodWorkspaceController],
      providers: [
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: MatsMethodChecksService,
          useFactory: mockCheckService,
        },
        {
          provide: MatsMethodWorkspaceService,
          useFactory: mockMatsMethodWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<MatsMethodWorkspaceController>(
      MatsMethodWorkspaceController,
    );
    service = module.get<MatsMethodWorkspaceService>(
      MatsMethodWorkspaceService,
    );
  });

  describe('getMethods', () => {
    it('should call the MatsMethodWorkspaceService.getMethods', () => {
      expect(controller.getMethods(locationId)).toEqual([]);
      expect(service.getMethods).toHaveBeenCalled();
    });
  });

  describe('createMethod', () => {
    it('should call the MatsMethodWorkspaceService.createMethod', async () => {
      expect(
        await controller.createMethod(
          locationId,
          matsMethodPayload,
          currentUser,
        ),
      ).toEqual({});
      expect(service.createMethod).toHaveBeenCalled();
    });
  });

  describe('updateMethod', () => {
    it('should call the MatsMethodWorkspaceService.updateMethod', async () => {
      expect(
        await controller.updateMethod(
          locationId,
          methodId,
          matsMethodPayload,
          currentUser,
        ),
      ).toEqual({});
      expect(service.updateMethod).toHaveBeenCalled();
    });
  });
});
