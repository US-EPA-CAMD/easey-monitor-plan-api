import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const monLoad = new MonitorLoad();
const monLoadDto = new MonitorLoadDTO();

const payload = new MonitorLoadBaseDTO();

const mockRepository = () => ({
  getLoadByLocBDateBHour: jest.fn().mockRejectedValue(monLoad),
  getLoad: jest.fn().mockRejectedValue(monLoad),
  findBy: jest.fn().mockResolvedValue([monLoad]),
  findOneBy: jest.fn().mockResolvedValue(monLoad),
  create: jest.fn().mockResolvedValue(monLoad),
  save: jest.fn().mockResolvedValue(monLoad),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(monLoadDto),
  many: jest.fn().mockResolvedValue([monLoadDto]),
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

  describe('getLoads', () => {
    it('should return array of monitor loads', async () => {
      const result = await service.getLoads('1');
      expect(result).toEqual([monLoadDto]);
    });
  });

  describe('getLoad', () => {
    it('should return monitor load record for a specific loadId', async () => {
      const result = await service.getLoad('1');
      expect(result).toEqual(monLoad);
    });

    it('should throw error when monitor load not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getLoad('1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createLoad', () => {
    it('creates a monitor load record for a specified locationId', async () => {
      const result = await service.createLoad('1', payload, 'testUser');
      expect(result).toEqual(monLoadDto);
    });
  });

  describe('updateLoad', () => {
    it('updates a monitor load record for a specified locationId', async () => {
      jest.spyOn(service, 'getLoad').mockResolvedValue(monLoad);

      const result = await service.updateLoad('1', '1', payload, 'testUser');
      expect(result).toEqual(monLoadDto);
    });
  });

  describe('importLoad', () => {
    it('should update while importing monitor load', async () => {
      jest
        .spyOn(repository, 'getLoadByLocBDateBHour')
        .mockResolvedValue(monLoad);
      const result = await service.importLoad('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
    it('should create while importing monitor load', async () => {
      jest
        .spyOn(repository, 'getLoadByLocBDateBHour')
        .mockResolvedValue(undefined);

      const result = await service.importLoad('1', [payload], 'testUser');
      expect(result).toEqual(true);
    });
  });
});
