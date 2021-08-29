import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceController } from './monitor-span.controller';

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
      controllers: [MonitorSpanWorkspaceController],
      providers: [MonitorSpanWorkspaceService],
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
