import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { EntityManager } from 'typeorm';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitMap } from '../maps/unit.map';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

const unit = new Unit();

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([]),
});

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(unit),
  findOneBy: jest.fn().mockResolvedValue(unit),
  save: jest.fn().mockResolvedValue({}),
});

const mockEntityManager = () => ({
  query: jest.fn().mockResolvedValue([unit]),
});

describe('UnitWorkspaceService', () => {
  let service: UnitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitService,
        {
          provide: UnitMap,
          useFactory: mockMap,
        },
        {
          provide: UnitRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(UnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnits', () => {
    it('should return an array of units', async () => {
      const result = await service.getUnit(1);
      expect(result).toEqual(unit);
    });
  });

  describe('getUnitByNameAndFacId', () => {
    it('should return a unit by name and facility ID', async () => {
      const unitName = 'Test Unit';
      const facilityId = 1;
      const result = await service.getUnitByNameAndFacId(unitName, facilityId);
      expect(result).toEqual(unit);
    });
  });
});
