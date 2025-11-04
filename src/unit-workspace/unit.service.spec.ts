import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { UnitBaseDTO, UnitDTO } from '../dtos/unit.dto';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitMap } from '../maps/unit.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

const unit = new Unit();
const unitDto = new UnitDTO();

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([]),
});

const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new UnitDTO()),
  save: jest.fn().mockResolvedValue({}),
});

const mockEntityManager = () => ({
  findOneBy: jest.fn().mockResolvedValue(new MonitorLocation()),
  query: jest.fn().mockResolvedValue([unitDto]),
});

jest.mock('@us-epa-camd/easey-common/check-catalog');

describe('UnitWorkspaceService', () => {
  let service: UnitWorkspaceService;
  let repository: UnitWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitWorkspaceService,
        {
          provide: UnitMap,
          useFactory: mockMap,
        },
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn(),
          }),
        },
        {
          provide: UnitWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(UnitWorkspaceService);
    repository = module.get(UnitWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnit', () => {
    it('should return a single unit', async () => {
      const result = await service.getUnit(1);
      expect(result).toEqual(unitDto);
    });
  });

  describe('updateUnit', () => {
    it('should return the updated unit', async () => {
      const payload = new UnitBaseDTO();

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(unit);
      jest.spyOn(repository, 'save').mockResolvedValue(unit);
      jest.spyOn(service as any, 'getUnitDetails').mockResolvedValue(unitDto);

      const result = await service.updateUnit(1, payload, 'userId');

      // Check if the getUnitDetails method was called
      expect(service['getUnitDetails']).toHaveBeenCalledWith(1);

      // Check if the result is the first element of the mocked UnitDTO array
      expect(result).toBe(unitDto);
    });
  });

  describe('IMPORT-2-A check', () => {
    const facilityId = 1;
    const orisCode = 12345;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return IMPORT-2-A', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.orisCode = orisCode;

      const location = new UpdateMonitorLocationDTO();
      location.unitId = 'NONEXISTENT_UNIT';

      plan.monitoringLocationData = [location];

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.runUnitChecks(plan, facilityId);

      expect(result).toContain(
        CheckCatalogService.formatResultMessage('IMPORT-2-A', {
          orisCode: orisCode,
          unitId: 'NONEXISTENT_UNIT'
        })
      );
    });

    it('should not return IMPORT-2-A', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.orisCode = orisCode;

      const location = new UpdateMonitorLocationDTO();
      location.unitId = 'EXISTING_UNIT';

      plan.monitoringLocationData = [location];

      const mockUnit = new Unit();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUnit);

      const result = await service.runUnitChecks(plan, facilityId);

      expect(result).toHaveLength(0);
    });

    it('should skip IMPORT-2-A check when unitId is null', async () => {
      const plan = new UpdateMonitorPlanDTO();
      plan.orisCode = orisCode;

      const location = new UpdateMonitorLocationDTO();
      location.unitId = null;

      plan.monitoringLocationData = [location];

      const result = await service.runUnitChecks(plan, facilityId);

      expect(result).toHaveLength(0);
      expect(repository.findOneBy).not.toHaveBeenCalled();
    });


  });
});
