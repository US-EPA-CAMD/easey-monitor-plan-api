import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityBaseDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedUnitCapacity: UnitCapacityDTO = new UnitCapacityDTO();

const unitCapacity = new UnitCapacity();

const payload = new UnitCapacityBaseDTO();

const mockRepository = () => ({
  getUnitCapacities: jest.fn().mockResolvedValue(unitCapacity),
  getUnitCapacity: jest.fn().mockResolvedValue(unitCapacity),
  getUnitCapacityByUnitIdAndDate: jest.fn().mockResolvedValue(unitCapacity),
  create: jest.fn().mockResolvedValue(unitCapacity),
  save: jest.fn().mockResolvedValue(unitCapacity),
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
    repository = module.get<UnitCapacityWorkspaceRepository>(
      UnitCapacityWorkspaceRepository,
    );
  });

  describe('getUnitCapacities', () => {
    it('should return array of unit capacities', async () => {
      const result = await service.getUnitCapacities('1', 1);
      expect(result).toEqual([unitCapacity]);
    });
  });

  describe('getUnitCapacity', () => {
    it('should return unit capacity record for a specific unit capacity ID', async () => {
      const result = await service.getUnitCapacity('1', 1, '1');
      expect(result).toEqual(unitCapacity);
    });

    it('should throw error when unit capacity record not found', async () => {
      jest.spyOn(repository, 'getUnitCapacity').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitCapacity('1', 1, '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createUnitCapacity', () => {
    it('creates a unit capacity record for a specified unit ID', async () => {
      const result = await service.createUnitCapacity('1', 1, payload, '');
      expect(result).toEqual(returnedUnitCapacity);
    });
  });

  describe('updateUnitCapacity', () => {
    it('updates a unit fuel record for a specified unit fuel ID', async () => {
      jest.spyOn(repository, 'getUnitCapacity').mockResolvedValue(unitCapacity);

      const result = await service.updateUnitCapacity('1', 1, '1', payload, '');
      expect(result).toEqual(returnedUnitCapacity);
    });
  });

  describe('importDefault', () => {
    it('should update while importing monitor default', async () => {
      const result = await service.importUnitCapacity(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest
        .spyOn(repository, 'getUnitCapacityByUnitIdAndDate')
        .mockResolvedValue(undefined);

      const result = await service.importUnitCapacity(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
  });
});
