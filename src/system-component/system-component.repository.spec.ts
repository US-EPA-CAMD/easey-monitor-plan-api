import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder, DataSource } from 'typeorm';

import { SystemComponent } from '../entities/system-component.entity';
import { SystemComponentRepository } from './system-component.repository';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

const locationId = '1';
const monSysId = '1';

const sysComp = new SystemComponent();

jest.mock('@us-epa-camd/easey-common/connection');

const mockQueryBuilder = {
  where: jest.fn(),
  andWhere: jest.fn(),
  orderBy: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  getMany: jest.fn(),
};

const mockManager = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('SystemComponentRepository', () => {
  let repository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        SystemComponentRepository,
        { provide: SelectQueryBuilder, useFactory: () => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    repository = module.get(SystemComponentRepository);
    queryBuilder = module.get<SelectQueryBuilder<SystemComponent>>(
      SelectQueryBuilder,
    );
      (withSlaveConnection as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager))
  });

  describe('getComponents', () => {
    it('calls createQueryBuilder and get SystemComponent by locationId and monitor system id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysComp]);

      const result = await repository.getComponents(locationId, monSysId);

      expect(result).toEqual([sysComp]);
    });
  });

  describe('getComponentsBySystemIds', () => {
    it('calls createQueryBuilder and get SystemFuelFlows by monitor system ids', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([sysComp]);

      const result = await repository.getComponentsBySystemIds([monSysId]);

      expect(result).toEqual([sysComp]);
    });
  });
});
