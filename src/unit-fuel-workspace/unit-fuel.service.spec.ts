import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { UpdateUnitFuelDTO } from '../dtos/unit-fuel-update.dto';
import { UnitFuel } from '../entities/workspace/unit-fuel.entity';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

const locId = '6';
const unitRecordId = 1;
const unitFuelId = 'some unit fuel id';
const userId = 'testuser';

const returnedUnitFuels: UnitFuelDTO[] = [];
const returnedUnitFuel: UnitFuelDTO = new UnitFuelDTO();

const payload: UpdateUnitFuelDTO = {
  fuelCode: '',
  indicatorCode: '',
  ozoneSeasonIndicator: 1,
  demGCV: null,
  demSO2: null,
  beginDate: new Date(Date.now()),
  endDate: new Date(Date.now()),
};

const mockRepository = () => ({
  getUnitFuels: jest.fn().mockResolvedValue(returnedUnitFuels),
  getUnitFuel: jest.fn().mockResolvedValue(returnedUnitFuel),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(new UnitFuel()),
  create: jest.fn().mockResolvedValue(new UnitFuel()),
  save: jest.fn().mockResolvedValue(new UnitFuel()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([]),
});

describe('UnitFuelService', () => {
  let loadService: UnitFuelWorkspaceService;
  let loadRepository: UnitFuelWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitFuelWorkspaceService,
        {
          provide: UnitFuelWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: UnitFuelMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    loadService = module.get(UnitFuelWorkspaceService);
    loadRepository = module.get(UnitFuelWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(loadService).toBeDefined();
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      const result = await loadService.getUnitFuels(locId, unitRecordId);
      expect(result).toEqual([]);
    });
  });

  describe('getUnitFuel', () => {
    it('should return unit fuel record for a specific unit fuel ID', async () => {
      const result = await loadService.getUnitFuel(
        locId,
        unitRecordId,
        unitFuelId,
      );
      expect(result).toEqual({});
    });
  });

  describe('createUnitFuel', () => {
    it('creates a unit fuel record for a specified unit ID', async () => {
      const result = await loadService.createUnitFuel(
        userId,
        locId,
        unitRecordId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });

  describe('updateUnitFuel', () => {
    it('updates a unit fuel record for a specified unit fuel ID', async () => {
      const result = await loadService.updateUnitFuel(
        userId,
        locId,
        unitRecordId,
        unitFuelId,
        payload,
      );
      expect(result).toEqual({ ...result });
    });
  });
});
