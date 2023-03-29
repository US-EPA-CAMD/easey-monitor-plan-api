import { Test } from '@nestjs/testing';
import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';
import { SelectQueryBuilder } from 'typeorm';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';

const unitStackConfiguration = new UnitStackConfiguration();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('UnitStackConfigurationRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnitStackConfigurationRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
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
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfiguration]);

      const result = await repository.getUnitStackConfigsByUnitId('1', true);

      expect(result).toEqual([unitStackConfiguration]);
    });

    it('calls createQueryBuilder and gets all Unit Stack Configations from the repository when it is not a unit', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfiguration]);

      const result = await repository.getUnitStackConfigsByUnitId('1', false);

      expect(result).toEqual([unitStackConfiguration]);
    });
  });
});
