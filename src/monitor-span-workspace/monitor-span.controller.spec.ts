import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceController } from './monitor-span.controller';
import { MonitorSpanBaseDTO } from '../dtos/monitor-span.dto';

jest.mock('./monitor-span.service');

const locId = 'some location id';
const spanId = 'someId';
const payload = new MonitorSpanBaseDTO();
const currentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

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

  describe('getSpans', () => {
    it('should return array of monitor spans', async () => {
      jest.spyOn(service, 'getSpans').mockResolvedValue(data);
      expect(await controller.getSpans(locId)).toBe(data);
    });
  });

  describe('updateSpan', () => {
    it('should return an updated monitor span', async () => {
      jest.spyOn(service, 'updateSpan').mockResolvedValue(data[0]);

      const result = await controller.updateSpan(
        locId,
        spanId,
        payload,
        currentUser,
      );
      expect(result).toBe(data[0]);
    });
  });

  describe('createSpan', () => {
    it('should return a monitor span', async () => {
      jest.spyOn(service, 'createSpan').mockResolvedValue(data[0]);

      const result = await controller.createSpan(locId, payload, currentUser);
      expect(result).toBe(data[0]);
    });
  });
});
