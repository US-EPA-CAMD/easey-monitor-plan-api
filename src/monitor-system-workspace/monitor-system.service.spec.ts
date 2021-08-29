import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSystemWorkspaceService', () => {
  let service: MonitorSystemWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorSystemWorkspaceService,
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSystemWorkspaceService);
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
