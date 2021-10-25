import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceController } from './monitor-load.controller';
import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./monitor-load.service');

const locId = 'some location id';
const loadId = 'some load id';
const payload = new UpdateMonitorLoadDTO();

const returnedLoads: MonitorLoadDTO[] = [];
returnedLoads.push(new MonitorLoadDTO());

const returnedLoad = new MonitorLoadDTO();

describe('MonitorLoadWorkspaceController', () => {
  let controller: MonitorLoadWorkspaceController;
  let service: MonitorLoadWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorLoadWorkspaceController],
      providers: [MonitorLoadWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(MonitorLoadWorkspaceController);
    service = module.get(MonitorLoadWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      jest.spyOn(service, 'getLoads').mockResolvedValue(returnedLoads);
      expect(await controller.getLoads(locId)).toBe(returnedLoads);
    });
  });

  describe('updateLoad', () => {
    it('should return array of monitor loads', async () => {
      jest.spyOn(service, 'updateLoad').mockResolvedValue(returnedLoad);
      expect(await controller.updateLoad(locId, loadId, payload, '')).toBe(
        returnedLoad,
      );
    });
  });

  describe('createLoad', () => {
    it('should return array of monitor loads', async () => {
      jest.spyOn(service, 'createLoad').mockResolvedValue(returnedLoad);
      expect(await controller.createLoad(locId, payload, '')).toBe(
        returnedLoad,
      );
    });
  });
});
