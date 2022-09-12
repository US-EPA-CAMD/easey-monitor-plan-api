import { Test } from '@nestjs/testing';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { SelectQueryBuilder } from 'typeorm';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

const locationId = '1';
const parameterCode = '1';
const beginDate = new Date();

const monMethod = new MonitorMethod();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
});

describe('MonitorMethodWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorMethodWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(MonitorMethodWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorMethod>>(
      SelectQueryBuilder,
    );
  });

  describe('getMethodByLocIdParamCDBDate', () => {
    it('calls createQueryBuilder and get one monitor method', async () => {
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(monMethod);

      const result = await repository.getMethodByLocIdParamCDBDate(
        locationId,
        parameterCode,
        beginDate,
      );

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(monMethod);
    });
  });
});
