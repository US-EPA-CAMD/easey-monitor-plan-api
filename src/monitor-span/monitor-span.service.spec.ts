import { Test } from '@nestjs/testing';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanRepository } from './monitor-span.repository';
import { MonitorSpanService } from './monitor-span.service';

const mockMonitorSpanRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn(),
});

describe('-- Monitor Span Service --', () => {
  let monitorSpanService;
  let monitorSpanRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorSpanService,
        {
          provide: MonitorSpanRepository,
          useFactory: mockMonitorSpanRepository,
        },
        { provide: MonitorSpanMap, useFactory: mockMap },
      ],
    }).compile();

    monitorSpanService = module.get(MonitorSpanService);
    monitorSpanRepository = module.get(MonitorSpanRepository);
    map = module.get(MonitorSpanMap);
  });

  describe('* getMonitorSpans', () => {
    it('should return all monitor spans with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorSpans');

      const monLocId = '123';

      const result = await monitorSpanService.getSpans(monLocId);

      expect(monitorSpanRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorSpans');
    });
  });

  describe('* getMonitorSpans', () => {
    it('should return all monitor spans with the specified monLocId', async () => {
      map.many.mockReturnValue('mockMonitorSpans');

      const monLocId = '123';

      const result = await monitorSpanService.getSpans(monLocId);

      expect(monitorSpanRepository.find).toHaveBeenCalled();
      expect(map.many).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorSpans');
    });
  });
});
