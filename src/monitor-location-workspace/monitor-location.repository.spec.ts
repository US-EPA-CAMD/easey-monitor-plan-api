import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
});

describe('MonitorLocationWorkspaceRepository', () => {
  let monitorLocationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MonitorLocationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monitorLocationRepository = module.get(MonitorLocationWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorLocation>>(
      SelectQueryBuilder,
    );
  });

  describe('getMonitorLocationsByFacId', () => {
    it('calls createQueryBuilder and gets all MonitorLocations from the repository with the specified facId', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([]);
      monitorLocationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);

      const result = await monitorLocationRepository.getMonitorLocationsByFacId(
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getLocationsByUnitStackPipeIds test', () => {
    it('calls the querybuilder and gets monitor location data', async () => {
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.leftJoin.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([]);
      monitorLocationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);

      const result = await monitorLocationRepository.getLocationsByUnitStackPipeIds(
        1,
        ['1'],
        ['1'],
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
