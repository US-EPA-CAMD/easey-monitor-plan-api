import { Test } from '@nestjs/testing';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SelectQueryBuilder } from 'typeorm';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';

const monSysId = '1';

const sysFuelFlow = new SystemFuelFlow();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  getMany: jest.fn(),
});

describe('SystemFuelFlowRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SystemFuelFlowRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SystemFuelFlowRepository);
    queryBuilder = module.get<SelectQueryBuilder<SystemFuelFlow>>(
      SelectQueryBuilder,
    );
  });

  describe('getFuelFlows', () => {
    it('calls createQueryBuilder and get SystemFuelFlows by monitor system id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
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
      queryBuilder.getMany.mockReturnValue([sysFuelFlow]);

      const result = await repository.getFuelFlowsBySystemIds([monSysId]);

      expect(result).toEqual([sysFuelFlow]);
    });
  });
});
