import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationRepository } from './monitor-location.repository';

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
      imports: [LoggerModule],
      providers: [
        EntityManager,
        MonitorLocationRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monitorLocationRepository = module.get(MonitorLocationRepository);
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
