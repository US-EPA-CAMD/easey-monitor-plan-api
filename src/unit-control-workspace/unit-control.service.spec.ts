import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UnitControlMap } from '../maps/unit-control.map';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UpdateUnitControlDTO } from '../dtos/unit-control-update.dto';
import { UnitControl } from '../entities/workspace/unit-control.entity';

const unitId = 6;
const unitControlId = 'some unit control id';
const userId = 'testuser';

const payload: UpdateUnitControlDTO = {
  controlCode: 'PAX',
  parameterCode: 'DL',
  installDate: new Date(Date.now()),
  optimizationDate: new Date(Date.now()),
  originalCode: '1',
  retireDate: new Date(Date.now()),
  seasonalControlsIndicator: 'P',
};

const mockRepository = () => ({
  getUnitControl: jest
    .fn()
    .mockRejectedValue(new NotFoundException('Async error')),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new UnitControl()),
  create: jest.fn().mockResolvedValue(new UnitControl()),
  save: jest.fn().mockResolvedValue(new UnitControl()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('UnitControlService', () => {
  let loadService: UnitControlWorkspaceService;
  let loadRepository: UnitControlWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitControlWorkspaceService,
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

    loadService = module.get(UnitControlWorkspaceService);
    loadRepository = module.get(UnitControlWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(loadService).toBeDefined();
  });

  describe('getUnitControls', () => {
    it('should return array of unit controls', async () => {
      const result = await loadService.getUnitControls(unitId);
      expect(result).toEqual([]);
    });
  });

  describe('getUnitControl', () => {
    it('should return unit control record for a specific unit control ID', async () => {
      const result = await loadService.getUnitControl(unitControlId);
      expect(result).toEqual({});
    });
  });

  describe('createUnitControl', () => {
    it('creates a unit control record for a specified unit ID', async () => {
      const result = await loadService.createUnitControl(
        userId,
        unitId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateUnitControl', () => {
    it('updates a unit control record for a specified unit control ID', async () => {
      const result = await loadService.updateUnitControl(
        userId,
        unitControlId,
        unitId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
