import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeBaseDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

jest.mock('./monitor-attribute.service');

const data = {
  locId: '6',
  attributeId: '1',
  currentUser: {
    userId: 'testUser',
    sessionId: '',
    expiration: '',
    clientIp: '',
    facilities: [],
    roles: [],
  },
  payload: new MonitorAttributeBaseDTO(),
};

const returnedAttributes: MonitorAttributeDTO[] = [];
returnedAttributes.push(new MonitorAttributeDTO());
const returnedAttribute = new MonitorAttributeDTO();

describe('MonitorAttributeWorkspaceController', () => {
  let controller: MonitorAttributeWorkspaceController;
  let service: MonitorAttributeWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorAttributeWorkspaceController],
      providers: [MonitorAttributeWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get<MonitorAttributeWorkspaceController>(
      MonitorAttributeWorkspaceController,
    );
    service = module.get<MonitorAttributeWorkspaceService>(
      MonitorAttributeWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should return array of LME qualifications', async () => {
      jest
        .spyOn(service, 'getAttributes')
        .mockResolvedValue(returnedAttributes);
      expect(await controller.getAttributes(data.locId)).toBe(
        returnedAttributes,
      );
    });
  });

  describe('createAttribute', () => {
    it('should return the created monitor attribute record', async () => {
      jest
        .spyOn(service, 'createAttribute')
        .mockResolvedValue(returnedAttribute);
      expect(
        await controller.createAttribute(
          data.locId,
          data.payload,
          data.currentUser,
        ),
      ).toBe(returnedAttribute);
    });
  });

  describe('updateAttribute', () => {
    it('should return updated monitor attribute record', async () => {
      jest
        .spyOn(service, 'updateAttribute')
        .mockResolvedValue(returnedAttribute);
      expect(
        await controller.updateAttribute(
          data.locId,
          data.attributeId,
          data.payload,
          data.currentUser,
        ),
      ).toBe(returnedAttribute);
    });
  });
});
