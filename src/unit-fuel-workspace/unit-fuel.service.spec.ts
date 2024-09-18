import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { UnitFuelBaseDTO } from '../dtos/unit-fuel.dto';
import { UnitFuel } from '../entities/workspace/unit-fuel.entity';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

jest.mock('../monitor-plan-workspace/monitor-plan.service.ts');

const returnedUnitFuel: UnitFuelDTO = new UnitFuelDTO();
const unitFuel = new UnitFuel();

const payload: UnitFuelBaseDTO = new UnitFuelBaseDTO();

const mockRepository = () => ({
  getUnitFuels: jest.fn().mockResolvedValue([unitFuel]),
  getUnitFuel: jest.fn().mockResolvedValue(unitFuel),
  getUnitFuelBySpecs: jest.fn().mockResolvedValue(unitFuel),
  findOneBy: jest.fn().mockResolvedValue(unitFuel),
  create: jest.fn().mockResolvedValue(unitFuel),
  save: jest.fn().mockResolvedValue(unitFuel),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(returnedUnitFuel),
  many: jest.fn().mockResolvedValue([returnedUnitFuel]),
});

describe('UnitFuelService', () => {
  let service: UnitFuelWorkspaceService;
  let repository: UnitFuelWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      providers: [
        UnitFuelWorkspaceService,
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn(),
          }),
        },
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

    service = module.get(UnitFuelWorkspaceService);
    repository = module.get(UnitFuelWorkspaceRepository);
  });

  describe('getUnitFuels', () => {
    it('should return array of unit fuels', async () => {
      const result = await service.getUnitFuels('1', 1);
      expect(result).toEqual([returnedUnitFuel]);
    });
  });

  describe('getUnitFuel', () => {
    it('should return unit fuel record for a specific unit fuel ID', async () => {
      const result = await service.getUnitFuel('1', 1, '1');
      expect(result).toEqual(returnedUnitFuel);
    });

    it('should throw error when unit fuel record not found', async () => {
      jest.spyOn(repository, 'getUnitFuel').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getUnitFuel('1', 1, '1');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createUnitFuel', () => {
    it('creates a unit fuel record for a specified unit ID', async () => {
      const result = await service.createUnitFuel({
        locationId: '1',
        unitId: 1,
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedUnitFuel);
    });
  });

  describe('updateUnitFuel', () => {
    it('updates a unit fuel record for a specified unit fuel ID', async () => {
      jest.spyOn(repository, 'getUnitFuel').mockResolvedValue(unitFuel);
      const result = await service.updateUnitFuel({
        locationId: '1',
        unitFuelId: '1',
        payload,
        userId: 'testUser',
      });
      expect(result).toEqual(returnedUnitFuel);
    });
  });

  describe('importUnitFuel', () => {
    it('should update while importing unit fuel', async () => {
      const result = await service.importUnitFuel(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
    it('should create while importing monitor default', async () => {
      jest.spyOn(repository, 'getUnitFuelBySpecs').mockResolvedValue(undefined);

      const result = await service.importUnitFuel(
        [payload],
        1,
        '1',
        'testUser',
      );
      expect(result).toEqual(true);
    });
  });
});
