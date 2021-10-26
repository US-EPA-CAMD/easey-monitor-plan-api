import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { MonitorMethodWorkspaceController } from './monitor-method.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./monitor-method.service');

const locId = 'some location id';

const data: MonitorMethodDTO[] = [];
data.push(new MonitorMethodDTO());
data.push(new MonitorMethodDTO());

describe('MonitorMethodWorkspaceController', () => {
  let controller: MonitorMethodWorkspaceController;
  let service: MonitorMethodWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorMethodWorkspaceController],
      providers: [MonitorMethodWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(MonitorMethodWorkspaceController);
    service = module.get(MonitorMethodWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMethods', () => {
    it('should return array of monitor methods', async () => {
      jest.spyOn(service, 'getMethods').mockResolvedValue(data);
      expect(await controller.getMethods(locId)).toBe(data);
    });
  });
});
