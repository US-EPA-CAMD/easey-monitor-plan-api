import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(''),
  many: jest.fn().mockResolvedValue(''),
});

describe('AnalyzerRangeWorkspaceService', () => {
  let service: AnalyzerRangeWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        AnalyzerRangeWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: AnalyzerRangeWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AnalyzerRangeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(AnalyzerRangeWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnalyzerRanges', () => {
    it('should return array of analyzer ranges', async () => {
      const result = await service.getAnalyzerRanges(null);
      expect(result).toEqual('');
    });
  });
});
