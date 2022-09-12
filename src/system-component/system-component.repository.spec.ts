import { Test } from '@nestjs/testing';
import { SystemComponent } from '../entities/system-component.entity';
import { SelectQueryBuilder } from 'typeorm';
import { SystemComponentRepository } from './system-component.repository';

const locationId = '1';
const monSysId = '1';

const sysComp = new SystemComponent();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  orderBy: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  getMany: jest.fn(),
});

describe('SystemComponentRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SystemComponentRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SystemComponentRepository);
    queryBuilder = module.get<SelectQueryBuilder<SystemComponent>>(
      SelectQueryBuilder,
    );
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
