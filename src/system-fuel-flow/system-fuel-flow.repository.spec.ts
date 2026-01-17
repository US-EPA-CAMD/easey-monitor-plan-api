import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

const monSysId = '1';

const sysFuelFlow = new SystemFuelFlow();

jest.mock('@us-epa-camd/easey-common/connection');

  const mockQueryBuilder = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockManager = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

describe('SystemFuelFlowRepository', () => {
  let repository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {} as DataSource;

    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        SystemFuelFlowRepository,
        { provide: SelectQueryBuilder, useFactory: () => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    repository = module.get(SystemFuelFlowRepository);
    queryBuilder = module.get<SelectQueryBuilder<SystemFuelFlow>>(
      SelectQueryBuilder,
    );
  });

  describe('getFuelFlows', () => {
    it('calls createQueryBuilder and get SystemFuelFlows by monitor system id', async () => {

      (withSlaveConnection as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager)) 
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([sysFuelFlow]);

      const result = await repository.getFuelFlows(monSysId);

      expect(result).toEqual([sysFuelFlow]);
    });
  });

  describe('getFuelFlowsBySystemIds', () => {
    it('calls createQueryBuilder and get SystemFuelFlows by monitor system ids', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.orderBy.mockReturnValue(queryBuilder);

      queryBuilder.getMany.mockReturnValue([sysFuelFlow]);

      const result = await repository.getFuelFlowsBySystemIds([monSysId]);

      expect(result).toEqual([sysFuelFlow]);
    });
  });
});
