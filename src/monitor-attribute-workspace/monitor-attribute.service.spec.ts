import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const attrId = '1';
const userId = 'testuser';

const payload = new MonitorAttributeBaseDTO();

const returnedMonitorAttribute = new MonitorAttributeDTO();
const returnedMonitorAttributes: MonitorAttributeDTO[] = [
  returnedMonitorAttribute,
];

const mockRepository = () => ({
  getAttribute: jest.fn(),
  getAttributeByLocIdAndDate: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn(),
  many: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttributes', () => {
    it('should return array of monitor attribute', async () => {
      repository.find = jest.fn().mockResolvedValue(returnedMonitorAttributes);
      const result = await service.getAttributes(locId);
      expect(repository.find).toHaveBeenCalledWith({ locId });
      expect(result).toEqual(returnedMonitorAttributes);
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
  });

  describe('getAttributeByLocIdAndDate', () => {
    it('should return monitor attribute for a specific location ID and begin or end date', async () => {
      repository.getAttributeByLocIdAndDate = jest
        .fn()
        .mockResolvedValue(returnedMonitorAttribute);
      const result = await service.getAttributeByLocIdAndDate(locId, payload);
      expect(repository.getAttributeByLocIdAndDate).toHaveBeenCalledWith(
        locId,
        payload,
      );
      expect(result).toEqual(returnedMonitorAttribute);
    });

    it('should return null for a specific qualification ID , location ID and qualification test data when not found', async () => {
      repository.getAttributeByLocIdAndDate = jest.fn().mockResolvedValue(null);
      const result = await service.getAttributeByLocIdAndDate(locId, payload);
      expect(repository.getAttributeByLocIdAndDate).toHaveBeenCalledWith(
        locId,
        payload,
      );
      expect(result).toEqual(null);
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
      const getAttributeByLocIdAndDate = jest
        .spyOn(service, 'getAttributeByLocIdAndDate')
        .mockResolvedValue(null);
      const createAttribute = jest
        .spyOn(service, 'createAttribute')
        .mockResolvedValue(returnedMonitorAttribute);
      await service.importAttributes(locId, [payload], userId);
      expect(getAttributeByLocIdAndDate).toHaveBeenCalledWith(locId, payload);
      expect(createAttribute).toHaveBeenCalled;
    });

    it('should update LEEQualification if exists', async () => {
      const getAttributeByLocIdAndDate = jest
        .spyOn(service, 'getAttributeByLocIdAndDate')
        .mockResolvedValue(returnedMonitorAttribute);
      const updateAttribute = jest
        .spyOn(service, 'updateAttribute')
        .mockResolvedValue(returnedMonitorAttribute);
      await service.importAttributes(locId, [payload], userId);
      expect(getAttributeByLocIdAndDate).toHaveBeenCalledWith(locId, payload);
      expect(updateAttribute).toHaveBeenCalled;
    });
  });
});
