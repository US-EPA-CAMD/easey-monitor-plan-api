import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceController } from './monitor-span.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

jest.mock('./monitor-span.service');

const locId = 'some location id';

const data: MonitorSpanDTO[] = [];
data.push(new MonitorSpanDTO());
data.push(new MonitorSpanDTO());

describe('MonitorSpanWorkspaceController', () => {
  let controller: MonitorSpanWorkspaceController;
  let service: MonitorSpanWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MonitorSpanWorkspaceController],
      providers: [MonitorSpanWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(MonitorSpanWorkspaceController);
    service = module.get(MonitorSpanWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSpans', () => {
    it('should return array of monitor spans', async () => {
      jest.spyOn(service, 'getSpans').mockResolvedValue(data);
      expect(await controller.getSpans(locId)).toBe(data);
    });
  });
});
