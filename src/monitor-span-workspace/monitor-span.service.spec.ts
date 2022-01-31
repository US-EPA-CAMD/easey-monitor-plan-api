import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

const mockMpWksService = () => ({});

describe('MonitorSpanWorkspaceService', () => {
  let service: MonitorSpanWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, LoggerModule],
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
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: mockMpWksService,
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
