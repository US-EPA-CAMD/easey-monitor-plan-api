import { Test, TestingModule } from '@nestjs/testing';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('AnalyzerRangeWorkspaceService', () => {
  let service: AnalyzerRangeWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AnalyzerRangeWorkspaceService,
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
