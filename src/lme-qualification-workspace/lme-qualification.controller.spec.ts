import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationWorkspaceController } from './lme-qualification.controller';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationBaseDTO } from '../dtos/lme-qualification.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./lme-qualification.service');

const locId = '6';
const qualId = '1';
const lmeQualId = 'some lme qualification id';
const payload = new LMEQualificationBaseDTO();

const returnedLMEQualifications: LMEQualificationDTO[] = [];
returnedLMEQualifications.push(new LMEQualificationDTO());

const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const returnedLoad = new LMEQualificationDTO();

describe('LMEQualificationWorkspaceController', () => {
  let controller: LMEQualificationWorkspaceController;
  let service: LMEQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
      controllers: [LMEQualificationWorkspaceController],
      providers: [
        LMEQualificationWorkspaceService,
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(LMEQualificationWorkspaceController);
    service = module.get(LMEQualificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLMEQualifications', () => {
    it('should return array of LME qualifications', async () => {
      jest
        .spyOn(service, 'getLMEQualifications')
        .mockResolvedValue(returnedLMEQualifications);
      expect(await controller.getLMEQualifications(locId, qualId)).toBe(
        returnedLMEQualifications,
      );
    });
  });

  describe('updateLMEQualification', () => {
    it('should return updated LME qualification', async () => {
      jest
        .spyOn(service, 'updateLMEQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.updateLMEQualification(
          locId,
          qualId,
          lmeQualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });

  describe('createLMEQualification', () => {
    it('should return the created LME qualification record', async () => {
      jest
        .spyOn(service, 'createLMEQualification')
        .mockResolvedValue(returnedLoad);
      expect(
        await controller.createLMEQualification(
          locId,
          qualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedLoad);
    });
  });
});
