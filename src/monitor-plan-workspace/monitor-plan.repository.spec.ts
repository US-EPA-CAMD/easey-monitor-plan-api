import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

const mp = new MonitorPlan();
const mpArray = [mp];

const mockQueryBuilder = () => ({
  query: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  innerJoin: jest.fn(),
  innerJoinAndSelect: jest.fn(() => mpArray),
  findOne: jest.fn(),
});

describe('Monitor Plan Repository', () => {
  let monitorPlanRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MonitorPlanWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    monitorPlanRepository = module.get(MonitorPlanWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorPlan>>(
      SelectQueryBuilder,
    );

    jest
      .spyOn(queryBuilder, 'innerJoinAndSelect')
      .mockReturnValue(queryBuilder);
  });

  it('calls createQueryBuilder and gets all MonitorPlan data from the repository', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue(mpArray);

    const orisCode = 123;
    const result = await monitorPlanRepository.getMonitorPlansByOrisCode(
      orisCode,
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual(mpArray);
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

  it('calls revertToOfficialRecord to revert a monitor plan to the official submitted version', async () => {
    monitorPlanRepository.query = jest.fn();
    await monitorPlanRepository.revertToOfficialRecord(1);
    expect(monitorPlanRepository.query).toHaveBeenCalled();
  });

  it('calls revertToOfficialRecord and throws an error', async () => {
    try {
      monitorPlanRepository.query = jest.fn(() => {
        throw new BadRequestException();
      });
      await monitorPlanRepository.revertToOfficialRecord();
    } catch (e) {
      const exception = new BadRequestException();
      expect(e).toStrictEqual(exception);
    }
  });

  it('calls updateDateAndUserId to save the current time and user to a monitor plan', async () => {
    monitorPlanRepository.query = jest.fn();
    await monitorPlanRepository.updateDateAndUserId(1);
    expect(monitorPlanRepository.query).toHaveBeenCalled();
  });

  it('calls updateDateAndUserId and throws an error', async () => {
    try {
      monitorPlanRepository.query = jest.fn(() => {
        throw new BadRequestException();
      });
      await monitorPlanRepository.updateDateAndUserId();
    } catch (e) {
      const exception = new BadRequestException();
      expect(e).toStrictEqual(exception);
    }
  });

  it('calls getActivePlanByLocation and gets the active monitor plan of a monitor location', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockReturnValue(mp);

    const result = await monitorPlanRepository.getActivePlanByLocationId(1);
    expect(queryBuilder.getOne).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('calls resetToNeedsEvaluation to update the evaluation status of a monitor plan to Needs Evaluation', async () => {
    monitorPlanRepository.query = jest.fn();
    monitorPlanRepository.findOne = jest.fn();
    await monitorPlanRepository.resetToNeedsEvaluation(1);
    expect(monitorPlanRepository.query).toHaveBeenCalled();
  });

  it('calls resetToNeedsEvaluation and throws an error', async () => {
    try {
      monitorPlanRepository.query = jest.fn(() => {
        throw new BadRequestException();
      });
      monitorPlanRepository.findOne = jest.fn();
      await monitorPlanRepository.resetToNeedsEvaluation(1);
    } catch (e) {
      const exception = new BadRequestException();
      expect(e).toStrictEqual(exception);
    }
  });

  it('calls createQueryBuilder and gets all MonitorPlan data from the repository', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue(mpArray);

    const orisCode = 123;
    const result = await monitorPlanRepository.getMonitorPlansByOrisCodes([
      orisCode,
    ]);
    expect(queryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual(mpArray);
  });

  it('calls createQueryBuilder and gets data for specific MonitorPlans from the repository', async () => {
    monitorPlanRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue(mp);

    const result = await monitorPlanRepository.getMonitorPlanByIds([1]);
    expect(queryBuilder.getMany).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
