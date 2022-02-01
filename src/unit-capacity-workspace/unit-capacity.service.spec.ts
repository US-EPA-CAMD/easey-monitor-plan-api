import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UpdateUnitCapacityDTO } from '../dtos/unit-capacity-update.dto';
import { UnitCapacity } from '../entities/unit-capacity.entity';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const locId = '6';
const unitRecordId = 1;
const id = '1';
const userId = 'testuser';

const returnedUnitCapacities: UnitCapacityDTO[] = [];
const returnedUnitCapacity: UnitCapacityDTO = new UnitCapacityDTO();
returnedUnitCapacities.push(returnedUnitCapacity);

const payload: UpdateUnitCapacityDTO = {
  maximumHourlyHeatInputCapacity: 1,
  beginDate: new Date(Date.now()),
  endDate: new Date(Date.now()),
};

const mockRepository = () => ({
  getUnitCapacities: jest.fn().mockResolvedValue(returnedUnitCapacities),
  getUnitCapacity: jest.fn().mockResolvedValue(returnedUnitCapacities),
  find: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(new UnitCapacity()),
  create: jest.fn().mockResolvedValue(new UnitCapacity()),
  save: jest.fn().mockResolvedValue(new UnitCapacity()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedUnitCapacity),
  many: jest.fn().mockResolvedValue([returnedUnitCapacity]),
});

describe('UnitCapacityWorkspaceService', () => {
  let service: UnitCapacityWorkspaceService;
  let repository: UnitCapacityWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitCapacityWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: UnitCapacityWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitCapacityMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<UnitCapacityWorkspaceService>(
      UnitCapacityWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnitCapacities', () => {
    it('should return array of unit capacities', async () => {
      const result = await service.getUnitCapacities(locId, unitRecordId);
      expect(result).toEqual(returnedUnitCapacities);
    });
  });

  describe('getUnitCapacity', () => {
    it('should return unit capacity record for a specific unit capacity ID', async () => {
      const result = await service.getUnitCapacity(locId, unitRecordId, id);
      expect(result).toEqual(returnedUnitCapacity);
    });
  });

  describe('createUnitCapacity', () => {
    it('creates a unit capacity record for a specified unit ID', async () => {
      const result = await service.createUnitCapacity(
        userId,
        locId,
        unitRecordId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateUnitCapacity', () => {
    it('updates a unit fuel record for a specified unit fuel ID', async () => {
      const result = await service.updateUnitCapacity(
        userId,
        locId,
        unitRecordId,
        id,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
