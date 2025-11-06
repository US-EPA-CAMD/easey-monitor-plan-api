import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';
import { DataSource } from 'typeorm';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

const unitStackConfiguration = new UnitStackConfiguration();

jest.mock('../utilities/use-slave-query');

const mockQueryBuilder = {
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
};

const mockManager = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('UnitStackConfigurationRepository', () => {
  let repository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitStackConfigurationRepository,
        { provide: SelectQueryBuilder, useFactory: () => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    repository = module.get(UnitStackConfigurationRepository);
    queryBuilder = module.get<
      SelectQueryBuilder<UnitStackConfigurationRepository>
    >(SelectQueryBuilder);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getUnitStackConfigsByLocationIds', () => {
    it('calls createQueryBuilder and gets all Unit Stack Configurations from the repository', async () => {
      (useSlaveQueryRunner as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager))
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitStackConfiguration]);

      const result = await repository.getUnitStackConfigsByLocationIds(['1']);

      expect(result).toEqual([unitStackConfiguration]);
    });
  });

  describe('getUnitStackConfigsByUnitId', () => {
    it('calls createQueryBuilder and gets all Unit Stack Configations from the repository when it is a unit', async () => {
      (useSlaveQueryRunner as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager)) 
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfiguration]);

      const result = await repository.getUnitStackConfigsByUnitId('1', true);

      expect(result).toEqual([unitStackConfiguration]);
    });

    it('calls createQueryBuilder and gets all Unit Stack Configations from the repository when it is not a unit', async () => {
      (useSlaveQueryRunner as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager)) 
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfiguration]);

      const result = await repository.getUnitStackConfigsByUnitId('1', false);

      expect(result).toEqual([unitStackConfiguration]);
    });
  });
});
