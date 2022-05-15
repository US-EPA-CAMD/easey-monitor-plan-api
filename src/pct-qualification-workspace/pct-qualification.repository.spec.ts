import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualification } from '../entities/workspace/pct-qualification.entity';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('PCTQualificationWorkspaceRepository', () => {
  let pctQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PCTQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    pctQualificationRepository = module.get(
      PCTQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<PCTQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getPCTQualification', () => {
    it('calls createQueryBuilder and gets all PCTQualifications from the repository with the specified facId', async () => {
      pctQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockPCTQualification');

      const result = await pctQualificationRepository.getPCTQualification(
        0,
        0,
        0,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockPCTQualification');
    });
  });

  describe('getPCTQualifications', () => {
    it('calls createQueryBuilder and gets all PCTQualifications from the repository with the specified facId', async () => {
      pctQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockPCTQualifications');

      const result = await pctQualificationRepository.getPCTQualifications(
        0,
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockPCTQualifications');
    });
  });

  describe('getLMEQualificationByDataYear', () => {
    it('calls createQueryBuilder and gets all PCTQualifications from the repository with the specified qualification id and data year', async () => {
      pctQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(new PCTQualification());

      const result = await pctQualificationRepository.getPCTQualificationByDataYear(
        0,
        0,
        1990,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(new PCTQualification());
    });
  });
});
