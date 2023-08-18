import { Test, TestingModule } from '@nestjs/testing';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { MonitorPlanService } from '../monitor-plan/monitor-plan.service';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

const MON_PLAN_ID = 'MON_PLAN_ID';
const ORIS_CODE = 2;
const ORIS_CODES_AND_LAST_UPDATED = {
  changedOrisCodes: [ORIS_CODE],
  mostRecentUpdate: '',
};
const ENTITY = new MonitorPlan();
const DTO = new MonitorPlanDTO();
DTO.locations = [new MonitorLocationDTO()];

const mockRepository = () => ({
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

describe('MonitorConfigurationsService', () => {
  let service: MonitorConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
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

  describe('getConfigurationsByLastUpdated', () => {
    it('Should return a LastUpdatedConfigDTO for a Date', async () => {
      const result = await service.getConfigurationsByLastUpdated('');
      expect(result.changedConfigs).toEqual([DTO]);
    });
  });
});
