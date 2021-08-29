import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('MonitorSpanWorkspaceService', () => {
  let service: MonitorSpanWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorSpanWorkspaceService,
        {
          provide: MonitorSpanWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSpanMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorSpanWorkspaceService);
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
