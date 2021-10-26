import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceController } from './monitor-plan.controller';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutService } from './../user-check-out/user-check-out.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./monitor-plan.service');
jest.mock('../user-check-out/user-check-out.service');

const orisCode = null;

const data: MonitorPlanDTO[] = [];
data.push(new MonitorPlanDTO());
data.push(new MonitorPlanDTO());

const ucoData: UserCheckOutDTO[] = [];
ucoData.push(new UserCheckOutDTO());
ucoData.push(new UserCheckOutDTO());

describe('MonitorPlanWorkspaceController', () => {
  let controller: MonitorPlanWorkspaceController;
  let service: MonitorPlanWorkspaceService;
  let ucoService: UserCheckOutService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorPlanWorkspaceController],
      providers: [
        MonitorPlanWorkspaceService,
        UserCheckOutService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(MonitorPlanWorkspaceController);
    service = module.get(MonitorPlanWorkspaceService);
    ucoService = module.get(UserCheckOutService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfigurations', () => {
    it('should return array of monitor plan configurations', async () => {
      jest.spyOn(service, 'getConfigurations').mockResolvedValue(data);
      expect(await controller.getConfigurations(orisCode)).toBe(data);
    });
  });

  describe('getCheckedOutConfigurations', () => {
    it('should return array of monitor plan configurations checked out', async () => {
      jest
        .spyOn(ucoService, 'getCheckedOutConfigurations')
        .mockResolvedValue(ucoData);
      expect(await controller.getCheckedOutConfigurations()).toBe(ucoData);
    });
  });
});
