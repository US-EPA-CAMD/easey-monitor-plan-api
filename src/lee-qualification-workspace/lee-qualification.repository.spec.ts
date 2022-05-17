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
  let leeQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LEEQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    leeQualificationRepository = module.get(
      LEEQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<LEEQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getLEEQualification', () => {
    it('calls createQueryBuilder and gets all LEEQualifications from the repository with the specified facId', async () => {
      leeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockLEEQualification');

      const result = await leeQualificationRepository.getLEEQualification(
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
      leeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockLEEQualifications');

      const result = await leeQualificationRepository.getLEEQualifications(
        0,
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockLEEQualifications');
    });
  });

  describe('getLEEQualificationByTestDate', () => {
    it('calls createQueryBuilder and gets all LEEQualifications from the repository with the specified qualification id and test date', async () => {
      leeQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(new LEEQualification());

      const result = await leeQualificationRepository.getLEEQualificationByTestDate(
        0,
        0,
        1990,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(new LEEQualification());
    });
  });
});
