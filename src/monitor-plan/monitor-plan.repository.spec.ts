import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlan } from '../entities/monitor-plan.entity';

const mockQueryBuilder = () => ({
  getMany: jest.fn(),
  innerJoin: jest.fn(),
});

describe('-- Monitor Plan Repository --', () => {
  let monitorPlanRepository;
  let queryBuilder;

 beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monitorPlanRepository = module.get(MonitorPlanRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorPlan>>(
      SelectQueryBuilder,
    ); 
  });

  describe('* getMonitorPlansByOrisCode', () => {
    it('calls createQueryBuilder and gets all MonitorPlan data from the repository', async () => {
      monitorPlanRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilder);
      queryBuilder.innerJoin.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue('mockMonitorPlan');

      const orisCode = 123;

      const result = await monitorPlanRepository.getMonitorPlansByOrisCode(
        orisCode,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorPlan');
    });
  });
});
