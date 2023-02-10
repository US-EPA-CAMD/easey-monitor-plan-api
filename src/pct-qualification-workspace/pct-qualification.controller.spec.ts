import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationWorkspaceController } from './pct-qualification.controller';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationBaseDTO } from '../dtos/pct-qualification.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./pct-qualification.service');

const locId = '6';
const qualId = '1';
const pctQualId = 'some unit fuel id';
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};
const payload = new PCTQualificationBaseDTO();

const returnedPCTQualifications: PCTQualificationDTO[] = [];
returnedPCTQualifications.push(new PCTQualificationDTO());

const returnedLoad = new PCTQualificationDTO();

describe('PCTQualificationWorkspaceController', () => {
  let controller: PCTQualificationWorkspaceController;
  let service: PCTQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [PCTQualificationWorkspaceController],
      providers: [PCTQualificationWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(PCTQualificationWorkspaceController);
    service = module.get(PCTQualificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPCTQualifications', () => {
    it('should return array of PCT qualifications', async () => {
      jest
        .spyOn(service, 'getPCTQualifications')
        .mockResolvedValue(returnedPCTQualifications);
      expect(await controller.getPCTQualifications(locId, qualId)).toBe(
        returnedPCTQualifications,
      );
    });
  });

  describe('updatePCTQualification', () => {
    it('should return updated PCT qualification', async () => {
      jest
        .spyOn(service, 'updatePCTQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.updatePCTQualification(
          locId,
          qualId,
          pctQualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createPCTQualification', () => {
    it('should return the created unit fuel record', async () => {
      jest
        .spyOn(service, 'createPCTQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.createPCTQualification(
          locId,
          qualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });
});
