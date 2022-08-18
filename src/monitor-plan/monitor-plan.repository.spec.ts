import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlan } from '../entities/monitor-plan.entity';

const mp = new MonitorPlan();
const mpArray = [];
mpArray.push(mp);

const mockQueryBuilder = () => ({
  getOne: jest.fn(),
  getMany: jest.fn(),
  where: jest.fn(),
  innerJoin: jest.fn(),
  innerJoinAndSelect: jest.fn(() => mpArray),
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

  it('calls createQueryBuilder and gets all MonitorPlan data from the repository', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue(mpArray);

    const orisCode = 123;
    const result = await monitorPlanRepository.getMonitorPlansByOrisCode(
      orisCode,
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual(mpArray);
  });

  it('calls createQueryBuilder and gets all Oris codes that have been updated after a certain date', async () => {
    monitorPlanRepository.query = jest
      .fn()
      .mockResolvedValue([{ oris_code: 1, last_updated_time: 'Test' }]);

    const result = await monitorPlanRepository.getOrisCodesByLastUpdatedTime(
      new Date(),
    );

    console.log(result);

    expect(result.mostRecentUpdate).toEqual('Test');
  });

  it('calls createQueryBuilder and gets data for a specific MonitorPlan from the repository', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockReturnValue(mp);

    const result = await monitorPlanRepository.getMonitorPlan(1);
    expect(queryBuilder.getOne).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
