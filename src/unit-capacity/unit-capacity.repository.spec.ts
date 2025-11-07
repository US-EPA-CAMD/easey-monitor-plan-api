import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';
import { UnitCapacityRepository } from './unit-capacity.repository';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

const unitCapacity = new UnitCapacity();

jest.mock('@us-epa-camd/easey-common/connection');

const mockQueryBuilder = {
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
};

const mockManager = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
 };
 
describe('UnitCapacityRepository', () => {
  let repository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitCapacityRepository,
        { provide: SelectQueryBuilder, useFactory: () => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    repository = module.get(UnitCapacityRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitCapacityRepository>>(
      SelectQueryBuilder,
    );
  });

  describe('getUnitCapacities', () => {
    it('calls createQueryBuilder and gets all Unit Capacities from the repository with the specified LocId and UnitId', async () => {
    (withSlaveConnection as jest.Mock).mockImplementation(
      async (_dataSource, callback) =>
      callback(mockManager)
    )
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
