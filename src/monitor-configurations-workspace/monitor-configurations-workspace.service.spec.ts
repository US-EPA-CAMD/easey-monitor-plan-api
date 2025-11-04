import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { EvalStatusCode } from '../entities/eval-status-code.entity';
import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { PlantWorkspaceRepository } from '../plant-workspace/plant.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { VwMPLocationsAndUnitStackConfigurations } from '../entities/workspace/vw-mp-locations-and-unit-stack-configurations.entity';
import { VwMPLocationsAndUnitStackConfigurationsMap } from '../maps/vw-mp-locations-and-unit-stack-configurations.map';

const MON_PLAN_ID = 'MON_PLAN_ID';
const ORIS_CODE = 2;
const ENTITY = new MonitorPlan();
const DTO = new MonitorPlanDTO();

const mockRepository = () => ({
  find: jest.fn(),
});

const mockMap = () => ({
  many: jest.fn().mockResolvedValue([DTO]),
});

describe('MonitorConfigurationsWorkspaceService', () => {
  let service: MonitorConfigurationsWorkspaceService;
  let monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository;
  let plantWorkspaceRepository: PlantWorkspaceRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorConfigurationsWorkspaceService,
        {
          provide: EntityManager,
          useValue: {
            find: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: MonitorPlanWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: EvalStatusCodeRepository,
          useFactory: () => ({
            findOneBy: jest.fn().mockResolvedValue(new EvalStatusCode()),
          }),
        },
        {
          provide: SubmissionsAvailabilityStatusCodeRepository,
          useFactory: () => ({
            findOneBy: jest
              .fn()
              .mockResolvedValue(new SubmissionAvailabilityCode()),
          }),
        },
        {
          provide: MonitorPlanConfigurationMap,
          useFactory: mockMap,
        },
        {
          provide: VwMPLocationsAndUnitStackConfigurationsMap,
          useFactory: mockMap,
        },
        MonitorLocationWorkspaceRepository,
        PlantWorkspaceRepository,
        UnitStackConfigurationWorkspaceRepository,
      ],
    }).compile();

    service = module.get(MonitorConfigurationsWorkspaceService);
    entityManager = module.get(EntityManager);
    plantWorkspaceRepository = module.get(PlantWorkspaceRepository);
    monitorPlanWorkspaceRepository = module.get(MonitorPlanWorkspaceRepository);
  });

  describe('getAllConfigurations', () => {
    it('Should return an array of all MonitoringPlanDTOs', async () => {
      const mockEntities = [new VwMPLocationsAndUnitStackConfigurations()];
      jest.spyOn(entityManager, 'find').mockResolvedValue(mockEntities);
      const result = await service.getAllConfigurations();
      expect(result).toEqual([DTO]);
    });
  });

  describe('getConfigurations', () => {
    it('Should return an array of MonitoringPlanDTO matching a query by monPlanId', async () => {
      jest.spyOn(monitorPlanWorkspaceRepository, 'find').mockResolvedValue([]);
      jest.spyOn(plantWorkspaceRepository, 'find').mockResolvedValue([]);
      const result = await service.getConfigurations([], [MON_PLAN_ID]);
      expect(result.length).toEqual(1);
    });

    it('Should return an array of MonitoringPlanDTO matching a query by orisCode', async () => {
      jest.spyOn(monitorPlanWorkspaceRepository, 'find').mockResolvedValue([]);
      jest.spyOn(plantWorkspaceRepository, 'find').mockResolvedValue([]);
      const result = await service.getConfigurations([ORIS_CODE]);
      expect(result.length).toEqual(1);
    });
  });
});
