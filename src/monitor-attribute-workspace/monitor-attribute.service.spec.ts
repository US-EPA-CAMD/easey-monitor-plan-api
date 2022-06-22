import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const attrId = '1';
const userId = 'testuser';

const monAttr = new MonitorAttribute();

const payload = new MonitorAttributeBaseDTO();

const returnedMonitorAttribute = new MonitorAttributeDTO();

const mockRepository = () => ({
  getAttribute: jest.fn().mockResolvedValue(monAttr),
  getAttributeByLocIdAndDate: jest.fn().mockResolvedValue(monAttr),
  find: jest.fn().mockResolvedValue([monAttr]),
  create: jest.fn().mockResolvedValue(monAttr),
  update: jest.fn().mockResolvedValue(monAttr),
  save: jest.fn().mockResolvedValue(monAttr),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedMonitorAttribute),
  many: jest.fn().mockResolvedValue([returnedMonitorAttribute]),
});

describe('MonitorAttributeWorkspaceService', () => {
  let service: MonitorAttributeWorkspaceService;
  let repository: MonitorAttributeWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        MonitorAttributeWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: MonitorAttributeWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorAttributeMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorAttributeWorkspaceService>(
      MonitorAttributeWorkspaceService,
    );
    repository = module.get<MonitorAttributeWorkspaceRepository>(
      MonitorAttributeWorkspaceRepository,
    );
  });

  describe('getAttributes', () => {
    it('should return array of monitor attribute', async () => {
      const result = await service.getAttributes(locId);
      expect(result).toEqual([returnedMonitorAttribute]);
    });
  });

  describe('getAttribute', () => {
    it('should return monitor attribute for a specific attribute ID and location ID', async () => {
      repository.getAttribute = jest
        .fn()
        .mockResolvedValue(returnedMonitorAttribute);
      const result = await service.getAttribute(locId, attrId);
      expect(repository.getAttribute).toHaveBeenCalledWith(locId, attrId);
      expect(result).toEqual(returnedMonitorAttribute);
    });
    it('should throw error when monitor attribute not found', async () => {
      jest.spyOn(repository, 'getAttribute').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAttribute('1', '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createAttribute', () => {
    it('creates a monitor attribute for a specific qualification ID', async () => {
      const result = await service.createAttribute(locId, payload, userId);
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateAttribute', () => {
    it('updates a monitor attribute for a specific qualification ID and location ID', async () => {
      jest
        .spyOn(service, 'getAttribute')
        .mockResolvedValue(returnedMonitorAttribute);
      const result = await service.updateAttribute(
        locId,
        attrId,
        payload,
        userId,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('importAttributes', () => {
    it('should create monitor attribute if not exists', async () => {
      jest
        .spyOn(repository, 'getAttributeByLocIdAndDate')
        .mockResolvedValue(undefined);
      const retult = await service.importAttributes(locId, [payload], userId);
      expect(retult).toEqual(true);
    });

    it('should update attribute if exists', async () => {
      jest
        .spyOn(repository, 'getAttributeByLocIdAndDate')
        .mockResolvedValue(monAttr);
      const retult = await service.importAttributes(locId, [payload], userId);
      expect(retult).toEqual(true);
    });
  });
});
