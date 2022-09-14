import { Test } from '@nestjs/testing';
import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';
import { SelectQueryBuilder } from 'typeorm';
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
        UnitStackConfigurationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitStackConfigurationWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitStackConfiguration>>(
      SelectQueryBuilder,
    );
  });

  describe('getUnitStackById', () => {
    it('calls createQueryBuilder and get one unit stack configuration', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitStackConfigs);

      const result = await repository.getUnitStackById('uuid');
      expect(result).toEqual(unitStackConfigs);
    });
  });

  describe('getUnitStackByUnitIdStackIdBDate', () => {
    it('calls createQueryBuilder and get one unit stack configuration', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitStackConfigs);

      const result = await repository.getUnitStackByUnitIdStackIdBDate(
        'uuid',
        'uuid',
        beginDate,
      );
      expect(result).toEqual(unitStackConfigs);
    });
  });

  describe('getUnitStackConfigsByLocationIds', () => {
    it('calls createQueryBuilder and get list of unit stack configuration', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
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
});
