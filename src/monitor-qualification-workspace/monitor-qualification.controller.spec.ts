import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { DataSource } from 'typeorm';

import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MonitorQualificationBaseDTO } from '../dtos/monitor-qualification.dto';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

jest.mock('./monitor-qualification.service');

const qualId = 'some qualification id';
const locId = 'some location id';
const payload = new MonitorQualificationBaseDTO();

const data: MonitorQualificationDTO[] = [];
data.push(new MonitorQualificationDTO());
data.push(new MonitorQualificationDTO());

const returnedQualifications: MonitorQualificationDTO[] = [];
returnedQualifications.push(new MonitorQualificationDTO());

const returnedQualification = new MonitorQualificationDTO();

const currentUser: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

describe('MonitorQualificationWorkspaceController', () => {
  let controller: MonitorQualificationWorkspaceController;
  let service: MonitorQualificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorQualificationWorkspaceController],
      providers: [
        MonitorQualificationWorkspaceService,
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
      ],
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
          locId,
          qualId,
          payload,
          currentUser,
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
        await controller.createQualification(locId, payload, currentUser),
      ).toBe(returnedQualification);
    });
  });
});
