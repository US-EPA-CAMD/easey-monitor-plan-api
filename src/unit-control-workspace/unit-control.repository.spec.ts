import { Test } from '@nestjs/testing';
import { UnitControl } from '../entities/workspace/unit-control.entity';
import { SelectQueryBuilder } from 'typeorm';
import { UnitControlWorkspaceRepository } from './unit-control.repository';

const unitControl = new UnitControl();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  orderBy: jest.fn(),
});

describe('UnitControlWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnitControlWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitControlWorkspaceRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<UnitControlWorkspaceRepository>
    >(SelectQueryBuilder);
  });

  describe('getUnitControl', () => {
    it('calls createQueryBuilder and gets all Unit Control from the repository with the specified Id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitControl);

      const result = await repository.getUnitControl('1');

      expect(result).toEqual(unitControl);
    });
  });

  describe('getUnitControls', () => {
    it('calls createQueryBuilder and gets all Unit Controls from the repository with the specified LocId and UnitId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitControl]);

      const result = await repository.getUnitControls('1', 1);

      expect(result).toEqual([unitControl]);
    });
  });

  describe('getUnitControlByUnitIdParamCdControlCd', () => {
    it('calls createQueryBuilder and gets a Unit Control from the repository with the specified unitId, beginDate and endDate', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitControl);

      const result = await repository.getUnitControlByUnitIdParamCdControlCd(
        1,
        'CODE',
        'CODE',
        new Date(),
        new Date(),
      );

      expect(result).toEqual(unitControl);
    });
  });
});
