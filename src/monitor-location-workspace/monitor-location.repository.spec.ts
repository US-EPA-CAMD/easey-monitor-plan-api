import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
});

describe('MonitorLocationRepository', () => {
  let monitorLocationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
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
      monitorLocationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockMonitorLocations');

      const result = await monitorLocationRepository.getMonitorLocationsByFacId(
        0,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorLocations');
    });
  });
});
