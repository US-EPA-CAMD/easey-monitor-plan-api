import { Test, TestingModule } from '@nestjs/testing';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { EvalStatusCode } from '../entities/eval-status-code.entity';
import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
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
            findOne: jest.fn().mockResolvedValue(new EvalStatusCode()),
          }),
        },
        {
          provide: SubmissionsAvailabilityStatusCodeRepository,
          useFactory: () => ({
            findOne: jest
              .fn()
              .mockResolvedValue(new SubmissionAvailabilityCode()),
          }),
        },
        {
          provide: MonitorPlanConfigurationMap,
          useFactory: mockMonitorPlanMap,
        },
      ],
    }).compile();

    service = module.get<MonitorConfigurationsWorkspaceService>(
      MonitorConfigurationsWorkspaceService,
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
