import { Test } from '@nestjs/testing';
import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';
import { SelectQueryBuilder } from 'typeorm';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';

const unitCapacity = new UnitCapacity();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  orderBy: jest.fn(),
});

describe('UnitCapacityWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnitCapacityWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitCapacityWorkspaceRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<UnitCapacityWorkspaceRepository>
    >(SelectQueryBuilder);
  });

  describe('getUnitCapacity', () => {
    it('calls createQueryBuilder and gets a Unit Capacity from the repository with the specified Id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitCapacity);

      const result = await repository.getUnitCapacity('1');

      expect(result).toEqual(unitCapacity);
    });
  });

  describe('getUnitCapacities', () => {
    it('calls createQueryBuilder and gets all Unit Capacities from the repository with the specified LocId and UnitId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitCapacity]);

      const result = await repository.getUnitCapacities('1', 1);

      expect(result).toEqual([unitCapacity]);
    });
  });

  describe('getUnitCapacitiesByUnitIds', () => {
    it('calls createQueryBuilder and gets all Unit Capacities from the repository with the specified monSysIds', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitCapacity]);

      const result = await repository.getUnitCapacitiesByUnitIds(['1']);

      expect(result).toEqual([unitCapacity]);
    });
  });

  describe('getUnitCapacityByUnitIdAndDate', () => {
    it('calls createQueryBuilder and gets a Unit Capacity from the repository with the specified unitId, beginDate and endDate', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitCapacity);

      const result = await repository.getUnitCapacityByUnitIdAndDate(
        '1',
        new Date(),
        new Date(),
      );

      expect(result).toEqual(unitCapacity);
    });
  });
});
