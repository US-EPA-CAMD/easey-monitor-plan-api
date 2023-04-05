import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationWorkspaceController } from './lee-qualification.controller';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { LEEQualificationBaseDTO } from '../dtos/lee-qualification.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./lee-qualification.service');

const locId = '6';
const qualId = '1';
const leeQualId = 'some lee qualification id';
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const payload = new LEEQualificationBaseDTO();

const returnedLEEQualifications: LEEQualificationDTO[] = [];
returnedLEEQualifications.push(new LEEQualificationDTO());

const returnedLoad = new LEEQualificationDTO();

describe('LEEQualificationWorkspaceController', () => {
  let controller: LEEQualificationWorkspaceController;
  let service: LEEQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [LEEQualificationWorkspaceController],
      providers: [LEEQualificationWorkspaceService, ConfigService, AuthGuard],
    }).compile();

    controller = module.get(LEEQualificationWorkspaceController);
    service = module.get(LEEQualificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLEEQualifications', () => {
    it('should return array of LEE qualifications', async () => {
      jest
        .spyOn(service, 'getLEEQualifications')
        .mockResolvedValue(returnedLEEQualifications);
      expect(await controller.getLEEQualifications(locId, qualId)).toBe(
        returnedLEEQualifications,
      );
    });
  });

  describe('updateLEEQualification', () => {
    it('should return updated LEE qualification', async () => {
      jest
        .spyOn(service, 'updateLEEQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.updateLEEQualification(
          locId,
          qualId,
          leeQualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createLEEQualification', () => {
    it('should return the created unit fuel record', async () => {
      jest
        .spyOn(service, 'createLEEQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.createLEEQualification(
          locId,
          qualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });
});
