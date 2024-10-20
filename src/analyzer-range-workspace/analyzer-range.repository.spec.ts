import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

const analyzerRange = new AnalyzerRange();
const analyzerRangeBaseDto = new AnalyzerRangeBaseDTO();

const mockQueryBuilder = () => ({
  innerJoin: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
});

describe('AnalyzerRangeWorkspaceRepository', () => {
  let analyzerRangeRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnalyzerRangeWorkspaceRepository,
        EntityManager,
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
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(analyzerRange);

      const result = await analyzerRangeRepository.getAnalyzerRangeByComponentIdAndDate(
        'componentId',
        analyzerRangeBaseDto,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(analyzerRange);
    });
  });

  describe('getAnalyzerRangesByCompIds', () => {
    it('calls createQueryBuilder and get analyzer rangeS from the repository with thE list of componentIdS', async () => {
      analyzerRangeRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([analyzerRange]);

      const result = await analyzerRangeRepository.getAnalyzerRangesByCompIds(
        'componentId',
        analyzerRangeBaseDto,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([analyzerRange]);
    });
  });
});
