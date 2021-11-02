import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualification } from '../entities/workspace/lee-qualification.entity';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('LEEQualificationWorkspaceRepository', () => {
  let pctQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LEEQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    pctQualificationRepository = module.get(
      LEEQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<LEEQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getLEEQualification', () => {
    it('calls createQueryBuilder and gets all LEEQualifications from the repository with the specified facId', async () => {
      pctQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockLEEQualification');

      const result = await pctQualificationRepository.getLEEQualification(
        0,
        0,
        0,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockLEEQualification');
    });
  });

  describe('getLEEQualifications', () => {
    it('calls createQueryBuilder and gets all LEEQualifications from the repository with the specified facId', async () => {
      pctQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockLEEQualifications');

      const result = await pctQualificationRepository.getLEEQualifications(
        0,
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockLEEQualifications');
    });
  });
});
