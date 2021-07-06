import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemService } from './monitor-system.service';
import { MonitorSystemRepository } from './monitor-system.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSystemService', () => {
  let service: MonitorSystemService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorSystemService,
        {
          provide: MonitorSystemRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSystems', () => {
    it('should return array of monitor systems', async () => {
      const result = await service.getSystems(null);
      expect(result).toEqual('');
    });
  });
});
