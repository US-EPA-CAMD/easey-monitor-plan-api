import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { EvalStatusCode } from '../entities/eval-status-code.entity';
import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { Plant } from '../entities/workspace/plant.entity';
import { PlantWorkspaceRepository } from '../plant-workspace/plant.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';

const MON_PLAN_ID = 'MON_PLAN_ID';
const ORIS_CODE = 2;
const DATE = new Date();
const ORIS_CODES_AND_LAST_UPDATED = {
  changedOrisCodes: [ORIS_CODE],
  mostRecentUpdate: DATE,
};
const ENTITY = new MonitorPlan();
const DTO = new MonitorPlanDTO();
DTO.monitoringLocationData = [new MonitorLocationDTO()];

const mockRepository = () => ({
  find: jest.fn(),
  getMonitorPlanByIds: jest.fn().mockResolvedValue([ENTITY]),
  getMonitorPlansByOrisCodes: jest.fn().mockResolvedValue([ENTITY]),
  getOrisCodesByLastUpdatedTime: jest
    .fn()
    .mockResolvedValue(ORIS_CODES_AND_LAST_UPDATED),
});

const mockMonitorPlanMap = () => ({
  many: jest.fn().mockResolvedValue([DTO]),
});

const mockMonitorPlanService = () => ({
  exportMonitorPlan: jest.fn().mockResolvedValue(DTO),
});

describe('MonitorConfigurationsWorkspaceService', () => {
  let service: MonitorConfigurationsWorkspaceService;
  let plantWorkspaceRepository: PlantWorkspaceRepository;
  let monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EntityManager,
        MonitorConfigurationsWorkspaceService,
        {
          provide: MonitorPlanWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorPlanWorkspaceService,
          useFactory: mockMonitorPlanService,
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
          useFactory: mockMonitorPlanMap,
        },
        MonitorLocationWorkspaceRepository,
        PlantWorkspaceRepository,
        UnitStackConfigurationWorkspaceRepository,
      ],
    }).compile();

    service = module.get<MonitorConfigurationsWorkspaceService>(
      MonitorConfigurationsWorkspaceService,
    );
    plantWorkspaceRepository = module.get<PlantWorkspaceRepository>(
      PlantWorkspaceRepository,
    );
    monitorPlanWorkspaceRepository = module.get<MonitorPlanWorkspaceRepository>(
      MonitorPlanWorkspaceRepository,
    );
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
