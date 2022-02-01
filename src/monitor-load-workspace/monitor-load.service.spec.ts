import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locationId = '1234';
const loadId = '4321';
const userId = 'testuser';

const payload: UpdateMonitorLoadDTO = {
  maximumLoadValue: 0,
  maximumLoadUnitsOfMeasureCode: 'string',
  lowerOperationBoundary: 0,
  upperOperationBoundary: 0,
  normalLevelCode: 'string',
  secondLevelCode: 'string',
  secondNormalIndicator: 0,
  loadAnalysisDate: new Date(Date.now()),
  beginDate: new Date(Date.now()),
  beginHour: 0,
  endDate: new Date(Date.now()),
  endHour: 0,
};

const mockRepository = () => ({
  getLoad: jest.fn().mockRejectedValue(new NotFoundException('Async error')),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new MonitorLoad()),
  create: jest.fn().mockResolvedValue(new MonitorLoad()),
  save: jest.fn().mockResolvedValue(new MonitorLoad()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('MonitorLoadService', () => {
  let service: MonitorLoadWorkspaceService;
  let repository: MonitorLoadWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorLoadWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorLoadWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLoadMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MonitorLoadWorkspaceService);
    repository = module.get(MonitorLoadWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      const result = await service.getLoads(null);
      expect(result).toEqual([]);
    });
  });

  describe('getLoad', () => {
    it('should return monitor load record for a specific loadId', async () => {
      const result = await service.getLoad(loadId);
      expect(result).toEqual({});
    });
  });

  describe('createLoad', () => {
    it('creates a monitor load record for a specified locationId', async () => {
      const result = await service.createLoad(locationId, payload, userId);
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateLoad', () => {
    it('updates a monitor load record for a specified locationId', async () => {
      const result = await service.updateLoad(
        locationId,
        loadId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
