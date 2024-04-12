import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanService } from './monitor-span.service';
import { MonitorSpanRepository } from './monitor-span.repository';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSpanService', () => {
  let service: MonitorSpanService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorSpanService,
        {
          provide: MonitorSpanRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSpanMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSpanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpans', () => {
    it('should return array of monitor spans', async () => {
      const result = await service.getSpans(null);
      expect(result).toEqual('');
    });
  });
});
