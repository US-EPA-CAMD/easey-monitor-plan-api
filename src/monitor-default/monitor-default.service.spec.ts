import { Test, TestingModule } from '@nestjs/testing';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultService } from './monitor-default.service';
import { MonitorDefaultRepository } from './monitor-default.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorDefaultService', () => {
  let service: MonitorDefaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorDefaultService,
        {
          provide: MonitorDefaultRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorDefaultMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorDefaultService>(MonitorDefaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDefaults', () => {
    it('should return array of location defaults', async () => {
      const result = await service.getDefaults(null);
      expect(result).toEqual('');
    });
  });
});
