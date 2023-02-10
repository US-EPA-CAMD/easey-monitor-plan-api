import { Test, TestingModule } from '@nestjs/testing';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethodWorkspaceController } from './mats-method.controller';
import { MatsMethodWorkspaceService } from './mats-method.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

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
  isAdmin: false,
  permissionSet: [],
};

const mockMatsMethodWorkspaceService = () => ({
  getMethods: jest.fn(() => []),
  getMethod: jest.fn(() => ({})),
  createMethod: jest.fn(() => ({})),
  updateMethod: jest.fn(() => ({})),
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
    it('should call the MatsMethodWorkspaceService.createMethod', () => {
      expect(
        controller.createMethod(locationId, matsMethodPayload, currentUser),
      ).toEqual({});
      expect(service.createMethod).toHaveBeenCalled();
    });
  });

  describe('createMethods', () => {
    it('should call the MatsMethodWorkspaceService.updateMethod', () => {
      expect(
        controller.updateMethod(
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
