import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { EntityManager } from 'typeorm';

import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  addOrderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('MonitorQualificationWorkspaceRepository', () => {
  let MonitorQualificationRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MonitorQualificationWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    MonitorQualificationRepository = module.get(
      MonitorQualificationWorkspaceRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<MonitorQualification>>(
      SelectQueryBuilder,
    );
  });

  describe('getQualification', () => {
    it('calls createQueryBuilder and gets all MonitorQualifications from the repository with the specified facId', async () => {
      MonitorQualificationRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.addOrderBy.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue('mockMonitorQualification');

      const result = await MonitorQualificationRepository.getQualification(
        '1',
        '1',
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorQualification');
    });
  });
});
