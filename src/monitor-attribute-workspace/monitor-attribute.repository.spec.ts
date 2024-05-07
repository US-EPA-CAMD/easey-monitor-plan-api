import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { MonitorAttributeBaseDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttribute } from '../entities/monitor-attribute.entity';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';

const returnAttribute = new MonitorAttribute();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
});

describe('MonitorAttributeWorkspaceRepository', () => {
  let monitorAttributeRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MonitorAttributeWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monitorAttributeRepository = module.get<
      MonitorAttributeWorkspaceRepository
    >(MonitorAttributeWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorAttribute>>(
      SelectQueryBuilder,
    );
  });

  describe('getAttribute', () => {
    it('calls createQueryBuilder and gets all  monitor attribute from the repository with the specified location id and attribute id', async () => {
      monitorAttributeRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(returnAttribute);

      const result = await monitorAttributeRepository.getAttribute(0, 0);

      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(returnAttribute);
    });
  });

  describe('getAttributeByLocIdAndDate', () => {
    it('calls createQueryBuilder and gets all monitor attribute from the repository with the location id and begin or end date', async () => {
      monitorAttributeRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(returnAttribute);

      const result = await monitorAttributeRepository.getAttributeByLocIdAndDate(
        0,
        new MonitorAttributeBaseDTO(),
      );

      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(returnAttribute);
    });
  });
});
