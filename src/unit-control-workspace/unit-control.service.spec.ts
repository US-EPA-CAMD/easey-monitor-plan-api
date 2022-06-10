import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitControlMap } from '../maps/unit-control.map';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { UnitControl } from '../entities/workspace/unit-control.entity';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedUnitControl: UnitControlDTO = new UnitControlDTO();
const unitControl = new UnitControl();

const payload: UnitControlBaseDTO = new UnitControlBaseDTO();

const mockRepository = () => ({
  getUnitControls: jest.fn().mockResolvedValue([unitControl]),
  getUnitControl: jest.fn().mockResolvedValue(unitControl),
  getUnitControlByUnitIdParamCdControlCd: jest
    .fn()
    .mockResolvedValue(unitControl),
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
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
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      const result = await service.getUnitControls('1', 1);
      expect(result).toEqual([returnedUnitControl]);
    });
  });

  describe('getUnitControl', () => {
    it('should return unit control record for a specific unit control ID', async () => {
      const result = await service.getUnitControl('1', 1, '1');
      expect(result).toEqual(returnedUnitControl);
    });

    it('should throw error when unit control record not found', async () => {
      jest.spyOn(repository, 'getUnitControl').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitControl('1', 1, '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createUnitControl', () => {
    it('creates a unit control record for a specified unit ID', async () => {
      const result = await service.createUnitControl(
        'testUser',
        '1',
        1,
        payload,
      );
      expect(result).toEqual(returnedUnitControl);
    });
  });

  describe('updateUnitControl', () => {
    it('updates a unit control record for a specified unit control ID', async () => {
      jest.spyOn(repository, 'getUnitControl').mockResolvedValue(unitControl);

      const result = await service.updateUnitControl(
        'testUser',
        '1',
        1,
        '1',
        payload,
      );
      expect(result).toEqual(returnedUnitControl);
    });
  });

  describe('importDefault', () => {
    it('should update while importing monitor default', async () => {
      const result = await service.importUnitControl(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest
        .spyOn(repository, 'getUnitControlByUnitIdParamCdControlCd')
        .mockResolvedValue(undefined);

      const result = await service.importUnitControl(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
  });
});
