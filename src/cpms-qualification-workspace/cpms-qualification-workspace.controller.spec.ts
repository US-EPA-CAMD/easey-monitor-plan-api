import { Test, TestingModule } from '@nestjs/testing';
import { CPMSQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';
import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from '../dtos/cpms-qualification.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const returnedCPMSQualification = new CPMSQualificationDTO();
const returnedCPMSQualifications = [returnedCPMSQualification];

const locId = '6';
const qualId = '1';
const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const payload = new CPMSQualificationBaseDTO();

const mockService = () => ({
  getCPMSQualifications: jest
    .fn()
    .mockResolvedValue(returnedCPMSQualifications),
  createCPMSQualification: jest
    .fn()
    .mockResolvedValue(returnedCPMSQualification),
});

describe('CPMSQualificationWorkspaceController', () => {
  let controller: CPMSQualificationWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CPMSQualificationWorkspaceController],
      providers: [
        {
          provide: CPMSQualificationWorkspaceService,
          useFactory: mockService,
        },
        ConfigService,
        AuthGuard,
      ],
    }).compile();

    controller = module.get<CPMSQualificationWorkspaceController>(
      CPMSQualificationWorkspaceController,
    );
  });

  describe('getCPMSQualifications', () => {
    it('should return array of CPMS qualifications', async () => {
      expect(await controller.getCPMSQualifications(locId, qualId)).toBe(
        returnedCPMSQualifications,
      );
    });
  });

  describe('createCPMSQualification', () => {
    it('should return the created CPMS qual record', async () => {
      expect(
        await controller.createCPMSQualification(
          locId,
          qualId,
          payload,
          currentUser,
        ),
      ).toBe(returnedCPMSQualification);
    });
  });
});
