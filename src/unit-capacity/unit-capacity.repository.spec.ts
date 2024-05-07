import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';
import { UnitCapacityRepository } from './unit-capacity.repository';

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

describe('UnitCapacityRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitCapacityRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitCapacityRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitCapacityRepository>>(
      SelectQueryBuilder,
    );
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
});
