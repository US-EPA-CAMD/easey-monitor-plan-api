import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanService } from './monitor-span.service';
import { MonitorSpanController } from './monitor-span.controller';

jest.mock('./monitor-span.service');

const locId = 'some location id';

const data: MonitorSpanDTO[] = [];
data.push(new MonitorSpanDTO());
data.push(new MonitorSpanDTO());

describe('MonitorSpanController', () => {
  let controller: MonitorSpanController;
  let service: MonitorSpanService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorSpanController],
      providers: [MonitorSpanService],
    }).compile();

    controller = module.get(MonitorSpanController);
    service = module.get(MonitorSpanService);
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
