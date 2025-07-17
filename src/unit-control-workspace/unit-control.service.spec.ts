import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { UnitControlBaseDTO, UnitControlDTO } from '../dtos/unit-control.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { UnitControl } from '../entities/workspace/unit-control.entity';
import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlWorkspaceService } from './unit-control.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedUnitControl: UnitControlDTO = new UnitControlDTO();
const unitControl = new UnitControl();

const payload: UnitControlBaseDTO = new UnitControlBaseDTO();

const mockRepository = () => ({
  getUnitControls: jest.fn().mockResolvedValue([unitControl]),
  getUnitControl: jest.fn().mockResolvedValue(unitControl),
  getUnitControlBySpecsInstallOrRetireDate: jest.fn().mockResolvedValue(unitControl),
  create: jest.fn().mockResolvedValue(unitControl),
  save: jest.fn().mockResolvedValue(unitControl),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedUnitControl),
  many: jest.fn().mockResolvedValue([returnedUnitControl]),
});

describe('UnitControlService', () => {
  let service: UnitControlWorkspaceService;
  let repository: UnitControlWorkspaceRepository;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        EntityManager,
        UnitControlWorkspaceService,
        MonitorPlanWorkspaceService,
        {
          provide: UnitControlWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitControlMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(UnitControlWorkspaceService);
    repository = module.get(UnitControlWorkspaceRepository);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      const result = await service.getUnitControls(1);
      expect(result).toEqual([returnedUnitControl]);
    });
  });

  describe('createUnitControl', () => {
    it('creates a unit control record for a specified unit ID', async () => {
      jest
        .spyOn(entityManager, 'findOneBy')
        .mockResolvedValue(new MonitorLocation());
      const result = await service.createUnitControl({
        unitRecordId: 1,
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedUnitControl);
    });
  });

  describe('updateUnitControl', () => {
    it('updates a unit control record for a specified unit control ID', async () => {
      jest
        .spyOn(entityManager, 'findOneBy')
        .mockResolvedValue(new MonitorLocation());
      jest.spyOn(repository, 'getUnitControl').mockResolvedValue(unitControl);

      const result = await service.updateUnitControl({
        unitRecordId: 1,
        unitControlId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedUnitControl);
    });
  });

  describe('importUnitControl', () => {
    it('should update while importing monitor default', async () => {
      const result = await service.importUnitControl([payload], 1, 'testUser');
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest
        .spyOn(repository, 'getUnitControlBySpecsInstallOrRetireDate')
        .mockResolvedValue(undefined);

      const result = await service.importUnitControl([payload], 1, 'testUser');
      expect(result).toEqual(true);
    });
  });
});
