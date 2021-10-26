import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceController } from './monitor-system.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./monitor-system.service');

const locId = 'some location id';

const data: MonitorSystemDTO[] = [];
data.push(new MonitorSystemDTO());
data.push(new MonitorSystemDTO());

describe('MonitorSystemWorkspaceController', () => {
  let controller: MonitorSystemWorkspaceController;
  let service: MonitorSystemWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorSystemWorkspaceController],
      providers: [MonitorSystemWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(MonitorSystemWorkspaceController);
    service = module.get(MonitorSystemWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      jest.spyOn(service, 'getSystems').mockResolvedValue(data);
      expect(await controller.getSystems(locId)).toBe(data);
    });
  });
});
