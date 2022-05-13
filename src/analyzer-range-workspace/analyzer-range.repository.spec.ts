import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
});

describe('AnalyzerRangeWorkspaceRepository', () => {
  let analyzerRangeRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnalyzerRangeWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    analyzerRangeRepository = module.get(AnalyzerRangeWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<AnalyzerRange>>(
      SelectQueryBuilder,
    );
  });

  describe('getAnalyzerRangeByComponentIdAndDate', () => {
    it('calls createQueryBuilder and get one analyzer range from the repository with the specified componentId', async () => {
      analyzerRangeRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(new AnalyzerRange());

      const result = await analyzerRangeRepository.getAnalyzerRangeByComponentIdAndDate(
        'componentId',
        new AnalyzerRangeBaseDTO(),
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(new AnalyzerRange());
    });
  });
});
