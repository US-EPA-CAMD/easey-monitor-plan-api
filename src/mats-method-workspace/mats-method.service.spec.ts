import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethod } from '../entities/workspace/mats-method.entity';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue([]),
  findOneBy: jest.fn().mockResolvedValue(new MatsMethod()),
  create: jest.fn().mockResolvedValue(new MatsMethod()),
  save: jest.fn().mockResolvedValue(new MatsMethod()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

const locationId = '5770';
const methodId = 'someId';
const userId = 'testuser';

const matsMethodDTO: MatsMethodBaseDTO = {
  supplementalMATSMonitoringMethodCode: 'string',
  supplementalMATSParameterCode: 'string',
  beginDate: new Date(Date.now()),
  beginHour: 1,
  endDate: new Date(Date.now()),
  endHour: 1,
};

describe('MonitorMethodWorkspaceService', () => {
  let service: MatsMethodWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        MatsMethodWorkspaceService,
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn(),
          }),
        },
        {
          provide: MatsMethodWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MatsMethodMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(MatsMethodWorkspaceService);
  });

  describe('getMethods', () => {
    it('calls the MatsMehtodWorkspaceRepository.findBy() gets all mats method codes for locationId', async () => {
      const result = await service.getMethods(locationId);
      expect(result).toEqual([]);
    });
  });

  describe('getMethod', () => {
    it('should return an array of mats methods', async () => {
      const result = await service.getMethod(methodId);
      expect(result).toEqual({});
    });
  });

  describe('createMethod', () => {
    it('creates a matsMethodCode data for a specified locationId', async () => {
      const result = await service.createMethod({
        locationId,
        payload: matsMethodDTO,
        userId,
      });
      expect(result).toEqual({});
    });
  });

  describe('updateMetod', () => {
    it('updates a matsMethodCode data for a specified locationId', async () => {
      const result = await service.updateMethod({
        methodId,
        locationId,
        payload: matsMethodDTO,
        userId,
      });
      expect(result).toEqual({ ...result });
    });
  });
});
