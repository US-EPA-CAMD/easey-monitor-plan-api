import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';

const locationId = '1';
const beginDate = new Date();

const unitStackConfigs = new UnitStackConfiguration();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  getMany: jest.fn(),
});

describe('UnitStackConfigurationWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        UnitStackConfigurationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitStackConfigurationWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitStackConfiguration>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getUnitStackById', () => {
    it('calls createQueryBuilder and get one unit stack configuration', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(unitStackConfigs);

      const result = await repository.getUnitStackById('uuid');
      expect(result).toEqual(unitStackConfigs);
    });
  });

  describe('getUnitStackConfigByUnitIdStackId', () => {
    it('calls createQueryBuilder and get one unit stack configuration', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitStackConfigs);

      const result = await repository.getUnitStackConfigByUnitIdStackId(
        'uuid',
        'uuid',
        beginDate,
      );
      expect(result).toEqual(unitStackConfigs);
    });
  });

  describe('getUnitStackConfigsByLocationIds', () => {
    it('calls createQueryBuilder and get list of unit stack configuration', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitStackConfigs]);

      const result = await repository.getUnitStackConfigsByLocationIds([
        locationId,
      ]);
      expect(result).toEqual([unitStackConfigs]);
    });
  });

  describe('getUnitStackConfigsByUnitId', () => {
    it('calls createQueryBuilder and gets all Unit Stack Configations from the repository when it is a unit', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfigs]);

      const result = await repository.getUnitStackConfigsByUnitId('1', true);

      expect(result).toEqual([unitStackConfigs]);
    });

    it('calls createQueryBuilder and gets all Unit Stack Configations from the repository when it is not a unit', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([unitStackConfigs]);

      const result = await repository.getUnitStackConfigsByUnitId('1', false);

      expect(result).toEqual([unitStackConfigs]);
    });
  });
});
