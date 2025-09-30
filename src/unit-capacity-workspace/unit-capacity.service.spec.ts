import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import {
  UnitCapacityBaseDTO,
  UnitCapacityDTO,
} from '../dtos/unit-capacity.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';
import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedUnitCapacity: UnitCapacityDTO = new UnitCapacityDTO();

const unitCapacity = new UnitCapacity();

const payload = new UnitCapacityBaseDTO();

const mockRepository = () => ({
  getUnitCapacities: jest.fn().mockResolvedValue(unitCapacity),
  getUnitCapacity: jest.fn().mockResolvedValue(unitCapacity),
  getUnitCapacityByUnitIdBeginOrEndDate: jest.fn().mockResolvedValue(unitCapacity),
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
  let entityManager: EntityManager;
  const KEY = 'Unit Capacity';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EntityManager,
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
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('getUnitCapacities', () => {
    it('should return array of unit capacities', async () => {
      const result = await service.getUnitCapacities(1);
      expect(result).toEqual([unitCapacity]);
    });
  });

  describe('getUnitCapacity', () => {
    it('should return unit capacity record for a specific unit capacity ID', async () => {
      const result = await service.getUnitCapacity(1, '1');
      expect(result).toEqual(unitCapacity);
    });

    it('should throw error when unit capacity record not found', async () => {
      jest.spyOn(repository, 'getUnitCapacity').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitCapacity(1, '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createUnitCapacity', () => {
    it('creates a unit capacity record for a specified unit ID', async () => {
      jest
        .spyOn(entityManager, 'findOneBy')
        .mockResolvedValue(new MonitorLocation());
      const result = await service.createUnitCapacity({
        unitId: 1,
        payload,
        userId: '',
      });
      expect(result).toEqual(returnedUnitCapacity);
    });
  });

  describe('updateUnitCapacity', () => {
    it('updates a unit fuel record for a specified unit fuel ID', async () => {
      jest.spyOn(repository, 'getUnitCapacity').mockResolvedValue(unitCapacity);
      jest
        .spyOn(entityManager, 'findOneBy')
        .mockResolvedValue(new MonitorLocation());

      const result = await service.updateUnitCapacity({
        unitRecordId: 1,
        unitCapacityId: '1',
        payload,
        userId: '',
      });
      expect(result).toEqual(returnedUnitCapacity);
    });
  });

  describe('importUnitCapacity', () => {
    it('should update while importing unit capacity', async () => {
      const result = await service.importUnitCapacity([payload], 1, 'testUser');
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest
        .spyOn(repository, 'getUnitCapacityByUnitIdBeginOrEndDate')
        .mockResolvedValue(undefined);

      const result = await service.importUnitCapacity([payload], 1, 'testUser');
      expect(result).toEqual(true);
    });
  });

  describe('CAPAC-6-A check', () => {
    const unitId = 1;
    const duplicateBeginDate = new Date('2022-01-01');
    const duplicateEndDate = new Date('2022-12-31');


    it('should return CAPAC-6-A | begin date exists', async () => {
      const payload: UnitCapacityBaseDTO = {
        maximumHourlyHeatInputCapacity: 100,
        beginDate: duplicateBeginDate,
        endDate: new Date('2022-12-31'),
      };

      const existingCapacity = new UnitCapacityDTO();
      existingCapacity.beginDate = duplicateBeginDate;
      existingCapacity.endDate = new Date('2023-01-01');

      jest.spyOn(service, 'getUnitCapacities').mockResolvedValue([existingCapacity]);

      const result = await service['duplicateUnitCapacityChecks'](payload, unitId);

      expect(result).toContain(
        CheckCatalogService.formatResultMessage('CAPAC-6-A', {
          fieldnames: 'beginDate',
          recordtype: KEY
        })
      );
    });

    it('should return CAPAC-6-A | endDate date exists', async () => {
      const payload: UnitCapacityBaseDTO = {
        maximumHourlyHeatInputCapacity: 100,
        beginDate: new Date('2022-01-01'),
        endDate: duplicateEndDate,
      };

      const existingCapacity = new UnitCapacityDTO();
      existingCapacity.beginDate = new Date('2022-01-02');
      existingCapacity.endDate = duplicateEndDate;

      jest.spyOn(service, 'getUnitCapacities').mockResolvedValue([existingCapacity]);

      const result = await service['duplicateUnitCapacityChecks'](payload, unitId);

      expect(result).toContain(
        CheckCatalogService.formatResultMessage('CAPAC-6-A', {
          fieldnames: 'endDate',
          recordtype: KEY
        })
      );
    });
  });
});
