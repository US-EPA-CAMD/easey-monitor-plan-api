import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadService } from './monitor-load.service';
import { MonitorLoadRepository } from './monitor-load.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorLoadService', () => {
  let service: MonitorLoadService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MonitorLoadService,
        {
          provide: MonitorLoadRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLoadMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      const result = await service.getLoads(null);
      expect(result).toEqual('');
    });
  });
});
