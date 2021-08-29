import { Test, TestingModule } from '@nestjs/testing';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorLoadService', () => {
  let service: MonitorLoadWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorLoadWorkspaceService,
        {
          provide: MonitorLoadWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLoadMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorLoadWorkspaceService);
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
