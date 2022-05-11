import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualification } from '../entities/workspace/lme-qualification.entity';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('LMEQualificationWorkspaceRepository', () => {
  let lmeQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LMEQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    lmeQualificationRepository = module.get(
      LMEQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<LMEQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getLMEQualification', () => {
    it('calls createQueryBuilder and gets all LMEQualifications from the repository with the specified facId', async () => {
      lmeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockLMEQualification');

      const result = await lmeQualificationRepository.getLMEQualification(
        0,
        0,
        0,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockLMEQualification');
    });
  });

  describe('getLMEQualifications', () => {
    it('calls createQueryBuilder and gets all LMEQualifications from the repository with the specified facId', async () => {
      lmeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockLMEQualifications');

      const result = await lmeQualificationRepository.getLMEQualifications(
        0,
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockLMEQualifications');
    });
  });

  describe('getLMEQualificationByDataYear', () => {
    it('calls createQueryBuilder and gets all LMEQualifications from the repository with the specified qualification id and data year', async () => {
      lmeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockLMEQualification');

      const result = await lmeQualificationRepository.getLMEQualificationByDataYear(
        0,
        0,
        1990,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockLMEQualification');
    });
  });
});
