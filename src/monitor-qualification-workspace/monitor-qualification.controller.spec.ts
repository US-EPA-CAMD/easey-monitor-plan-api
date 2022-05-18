import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MonitorQualificationBaseDTO } from '../dtos/monitor-qualification.dto';

jest.mock('./monitor-qualification.service');

const currentUser = 'testuser';
const qualId = 'some qualification id';
const locId = 'some location id';
const payload = new MonitorQualificationBaseDTO();

const data: MonitorQualificationDTO[] = [];
data.push(new MonitorQualificationDTO());
data.push(new MonitorQualificationDTO());

const returnedQualifications: MonitorQualificationDTO[] = [];
returnedQualifications.push(new MonitorQualificationDTO());

const returnedQualification = new MonitorQualificationDTO();

describe('MonitorQualificationWorkspaceController', () => {
  let controller: MonitorQualificationWorkspaceController;
  let service: MonitorQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorQualificationWorkspaceController],
      providers: [MonitorQualificationWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(MonitorQualificationWorkspaceController);
    service = module.get(MonitorQualificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQualifications', () => {
    it('should return array of monitor systems', async () => {
      jest.spyOn(service, 'getQualifications').mockResolvedValue(data);
      expect(await controller.getQualifications(locId)).toBe(data);
    });
  });

  describe('updateQualification', () => {
    it('should return updated qualification', async () => {
      jest
        .spyOn(service, 'updateQualification')
        .mockResolvedValue(returnedQualification);
      expect(
        await controller.updateQualification(
          currentUser,
          locId,
          qualId,
          payload,
        ),
      ).toBe(returnedQualification);
    });
  });

  describe('createQualification', () => {
    it('should return the created qualification', async () => {
      jest
        .spyOn(service, 'createQualification')
        .mockResolvedValue(returnedQualification);
      expect(
        await controller.createQualification(currentUser, locId, payload),
      ).toBe(returnedQualification);
    });
  });
});
