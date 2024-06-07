import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { Plant } from '../entities/plant.entity';
import { PlantRepository } from '../plant/plant.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { MonitorPlanService } from '../monitor-plan/monitor-plan.service';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { MonitorConfigurationsService } from './monitor-configurations.service';

const MON_PLAN_ID = 'MON_PLAN_ID';
const ORIS_CODE = 2;
const ORIS_CODES_AND_LAST_UPDATED = {
  changedOrisCodes: [ORIS_CODE],
  mostRecentUpdate: '',
};
const ENTITY = new MonitorPlan();
const DTO = new MonitorPlanDTO();
DTO.monitoringLocationData = [new MonitorLocationDTO()];

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
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

const mockPlantRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
});

describe('MonitorConfigurationsService', () => {
  let service: MonitorConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EntityManager,
        MonitorConfigurationsService,
        {
          provide: MonitorPlanRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorPlanService,
          useFactory: mockMonitorPlanService,
        },
        {
          provide: MonitorPlanMap,
          useFactory: mockMonitorPlanMap,
        },
        {
          provide: PlantRepository,
          useFactory: mockPlantRepository,
        },
        UnitStackConfigurationRepository,
        MonitorLocationRepository,
      ],
    }).compile();

    service = module.get<MonitorConfigurationsService>(
      MonitorConfigurationsService,
    );
  });

  describe('getConfigurations', () => {
    it('Should return an array of MonitoringPlanDTO matching a query by monPlanId', async () => {
      const result = await service.getConfigurations([], [MON_PLAN_ID]);
      expect(result.length).toEqual(1);
    });

    it('Should return an array of MonitoringPlanDTO matching a query by orisCode', async () => {
      const result = await service.getConfigurations([ORIS_CODE]);
      expect(result.length).toEqual(1);
    });
  });
});
