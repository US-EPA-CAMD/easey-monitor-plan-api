import { Test, TestingModule } from '@nestjs/testing';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorDefaultWorkspaceService', () => {
  let service: MonitorDefaultWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorDefaultWorkspaceService,
        {
          provide: MonitorDefaultWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorDefaultMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorDefaultWorkspaceService>(
      MonitorDefaultWorkspaceService,
    );
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
