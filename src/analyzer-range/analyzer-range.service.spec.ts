import { Test, TestingModule } from '@nestjs/testing';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeService } from './analyzer-range.service';
import { AnalyzerRangeRepository } from './analyzer-range.repository';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue(''),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue(''),
});

describe('AnalyzerRangeService', () => {
  let service: AnalyzerRangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzerRangeService,
        {
          provide: AnalyzerRangeRepository,
          useFactory: mockRepository,
        },
        {
          provide: AnalyzerRangeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(AnalyzerRangeService);
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
