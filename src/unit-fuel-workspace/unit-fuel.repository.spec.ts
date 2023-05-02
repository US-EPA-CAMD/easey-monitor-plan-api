import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { UnitFuel } from '../entities/workspace/unit-fuel.entity';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

const unitFuel = new UnitFuel();

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  innerJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('UnitFuelWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnitFuelWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(UnitFuelWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<UnitFuelWorkspaceRepository>>(
      SelectQueryBuilder,
    );
  });

  describe('getUnitFuel', () => {
    it('calls createQueryBuilder and gets all Unit Fuel from the repository with the specified Id', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitFuel);

      const result = await repository.getUnitFuel('1');

      expect(result).toEqual(unitFuel);
    });
  });

  describe('getUnitFuels', () => {
    it('calls createQueryBuilder and gets all Unit Fuels from the repository with the specified LocId and UnitId', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([unitFuel]);

      const result = await repository.getUnitFuels('1', 1);

      expect(result).toEqual([unitFuel]);
    });
  });

  describe('getUnitFuelBySpecs', () => {
    it('calls createQueryBuilder and gets a Unit Fuel from the repository with the specified unitId, fuelCode and beginDate or endDate', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(unitFuel);

      const result = await repository.getUnitFuelBySpecs(1, 'CODE', new Date(), new Date());

      expect(result).toEqual(unitFuel);
    });
  });
});
