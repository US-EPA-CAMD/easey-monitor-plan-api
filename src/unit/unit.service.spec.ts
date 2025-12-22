import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { EntityManager, DataSource } from 'typeorm';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitMap } from '../maps/unit.map';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const unit = new Unit();

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([]),
});

const mockRepository = {
  findOne: jest.fn().mockResolvedValue(unit),
  findOneBy: jest.fn().mockResolvedValue(unit),
  save: jest.fn().mockResolvedValue({}),
};

const mockManager = {
  query: jest.fn().mockResolvedValue([unit]),
  createQueryBuilder: jest.fn().mockReturnValue(mockRepository),
}

describe('UnitWorkspaceService', () => {
  let service: UnitService;
  let dataSource: DataSource;

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
          useFactory: ()=> mockRepository,
        },
        EntityManager,
      {provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get(UnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnits', () => {
    it('should return an array of units', async () => {
      (withSlaveConnection as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager))
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
