import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanLocationService } from '../monitor-plan-location-workspace/monitor-plan-location.service';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { UnitProgramRepository } from '../unit-program/unit-program.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CountyCodeService } from '../county-code/county-code.service';
import { CountyCodeDTO } from '../dtos/county-code.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from '../monitor-configurations-workspace/submission-availability-status.repository';
import { EvalStatusCode } from '../entities/eval-status-code.entity';
import { SubmissionAvailabilityCode } from '../entities/submission-availability-code.entity';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { Component } from '../entities/workspace/component.entity';
import { DuctWaf } from '../entities/workspace/duct-waf.entity';
import { LEEQualification } from '../entities/workspace/lee-qualification.entity';
import { LMEQualification } from '../entities/workspace/lme-qualification.entity';
import { MatsMethod } from '../entities/workspace/mats-method.entity';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';
import { MonitorDefault } from '../entities/workspace/monitor-default.entity';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorPlanComment } from '../entities/workspace/monitor-plan-comment.entity';
import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { PCTQualification } from '../entities/workspace/pct-qualification.entity';
import { Plant } from '../entities/workspace/plant.entity';
import { SystemComponent } from '../entities/workspace/system-component.entity';
import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';
import { UnitControl } from '../entities/workspace/unit-control.entity';
import { UnitFuel } from '../entities/workspace/unit-fuel.entity';
import { LEEQualificationWorkspaceRepository } from '../lee-qualification-workspace/lee-qualification.repository';
import { LMEQualificationWorkspaceRepository } from '../lme-qualification-workspace/lme-qualification.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MatsMethodWorkspaceRepository } from '../mats-method-workspace/mats-method.repository';
import { MonitorAttributeWorkspaceRepository } from '../monitor-attribute-workspace/monitor-attribute.repository';
import { EvalStatusCodeRepository } from '../monitor-configurations-workspace/eval-status.repository';
import { MonitorDefaultWorkspaceRepository } from '../monitor-default-workspace/monitor-default.repository';
import { MonitorFormulaWorkspaceRepository } from '../monitor-formula-workspace/monitor-formula.repository';
import { MonitorLoadWorkspaceRepository } from '../monitor-load-workspace/monitor-load.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method.repository';
import { MonitorPlanCommentWorkspaceRepository } from '../monitor-plan-comment-workspace/monitor-plan-comment.repository';
import { MonitorPlanCommentWorkspaceService } from '../monitor-plan-comment-workspace/monitor-plan-comment.service';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.repository';
import { MonitorQualificationWorkspaceRepository } from '../monitor-qualification-workspace/monitor-qualification.repository';
import { MonitorSpanWorkspaceRepository } from '../monitor-span-workspace/monitor-span.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system.repository';
import { PCTQualificationWorkspaceRepository } from '../pct-qualification-workspace/pct-qualification.repository';
import { PlantService } from '../plant/plant.service';
import { SystemComponentWorkspaceRepository } from '../system-component-workspace/system-component.repository';
import { SystemFuelFlowWorkspaceRepository } from '../system-fuel-flow-workspace/system-fuel-flow.repository';
import { UnitCapacityWorkspaceRepository } from '../unit-capacity-workspace/unit-capacity.repository';
import { UnitControlWorkspaceRepository } from '../unit-control-workspace/unit-control.repository';
import { UnitFuelWorkspaceRepository } from '../unit-fuel-workspace/unit-fuel.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { UnitWorkspaceService } from '../unit-workspace/unit.service';
import { EaseyContentService } from '../monitor-plan-easey-content/easey-content.service';

const USER_ID = 'USER_ID';
const FAC_ID = 'FAC_ID';
const LOC_ID = 'LOC_ID';
const MON_PLAN_ID = 'MON_PLAN_ID';
const DTO = new MonitorPlanDTO();
DTO.monitoringLocationData = [];
DTO.beginReportPeriodId = 1;
const UPDATE_DTO = new UpdateMonitorPlanDTO();
UPDATE_DTO.monitoringLocationData = [];
UPDATE_DTO.unitStackConfigurationData = [];
const MONITOR_LOCATION = new MonitorLocation();
MONITOR_LOCATION.id = LOC_ID;
const MONITOR_PLAN = new MonitorPlan();
MONITOR_PLAN.plant = new Plant();

const mockPlantService = () => ({
  getFacIdFromOris: jest.fn().mockResolvedValue(FAC_ID),
});

const mockUnitService = () => ({
  getUnitsByMonPlanId: jest.fn().mockResolvedValue([]),
});

const mockMonitorLocationService = () => ({
  getMonitorLocationsByFacilityAndOris: jest
    .fn()
    .mockResolvedValue([MONITOR_LOCATION]),
  importMonitorLocations: jest.fn().mockResolvedValue([]),
});

const mockEaseyContentService = () => ({
  importMonitorPlan: jest.fn().mockResolvedValue({
    monitorPlanSchema: { version: '1.0.0' },
  }),
});

const mockMonitorPlanRepo = () => ({
  createMonitorPlanRecord: jest.fn().mockResolvedValue(MONITOR_PLAN),
  getActivePlanByLocationId: jest.fn().mockResolvedValue(MONITOR_PLAN),
  resetToNeedsEvaluation: jest.fn(),
  revertToOfficialRecord: jest.fn(),
  getMonitorPlan: jest.fn().mockResolvedValue(MONITOR_PLAN),
  updateDateAndUserId: jest.fn(),
  findOneBy: jest.fn().mockResolvedValue(MONITOR_PLAN),
  save: jest.fn().mockResolvedValue(MONITOR_PLAN),
});

const mockMonitorPlanCommentService = () => ({
  importComments: jest.fn(),
});

const mockUnitStackConfigService = () => ({
  getUnitStackConfigsByMonitorPlanId: jest.fn().mockResolvedValue([]),
  importUnitStacks: jest.fn().mockResolvedValue([]),
});

const mockEvalStatusCodeRepo = () => ({
  findOneBy: jest.fn().mockResolvedValue([new EvalStatusCode()]),
});
const mockSubmissionAvailabilityCodeRepo = () => ({
  findOneBy: jest.fn().mockResolvedValue([new SubmissionAvailabilityCode()]),
});
const mockMonitorLocationRepo = () => ({
  getMonitorLocationsByPlanId: jest.fn().mockResolvedValue([MONITOR_LOCATION]),
});
const mockCommentRepo = () => ({
  findBy: jest.fn().mockResolvedValue([new MonitorPlanComment()]),
});
const mockAttributeRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorAttribute()]),
});
const mockMethodRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorMethod()]),
});
const mockMatsMethodRepo = () => ({
  find: jest.fn().mockResolvedValue([new MatsMethod()]),
});
const mockFormulaRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorFormula()]),
});
const mockDefaultRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorDefault()]),
});
const mockSpanRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorSpan()]),
});
const mockDuctWafRepo = () => ({
  find: jest.fn().mockResolvedValue([new DuctWaf()]),
});
const mockLoadRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorLoad()]),
});
const mockComponentRepo = () => ({
  find: jest.fn().mockResolvedValue([new Component()]),
});
const mockSystemRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorSystem()]),
});
const mockUnitCapacityRepo = () => ({
  getUnitCapacitiesByUnitIds: jest.fn(),
});
const mockUnitControlRepo = () => ({
  find: jest.fn().mockResolvedValue([new UnitControl()]),
});
const mockUnitFuelRepo = () => ({
  find: jest.fn().mockResolvedValue([new UnitFuel()]),
});
const mockQualificationRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorQualification()]),
});
const mockSystemFuelFlowRepo = () => ({
  getFuelFlowsBySystemIds: jest.fn().mockResolvedValue([new SystemFuelFlow()]),
});
const mockSystemComponentRepo = () => ({
  getSystemComponentsBySystemIds: jest
    .fn()
    .mockResolvedValue([new SystemComponent()]),
});
const mockAnalyzerRangeRepo = () => ({
  getAnalyzerRangesByCompIds: jest
    .fn()
    .mockResolvedValue([new AnalyzerRange()]),
});
const mockLeeQualificationRepo = () => ({
  find: jest.fn().mockResolvedValue([new LEEQualification()]),
});
const mockLmeQualificationRepo = () => ({
  find: jest.fn().mockResolvedValue([new LMEQualification()]),
});
const mockPctQualificationRepo = () => ({
  find: jest.fn().mockResolvedValue([new PCTQualification()]),
});
const mockUnitStackConfigRepo = () => ({
  getUnitStackConfigsByMonitorPlanId: jest.fn().mockResolvedValue([]),
  getUnitStackConfigsByLocationIds: jest.fn(),
});
const mockReportingFreqRepo = () => ({
  createReportingFrequencyRecord: jest
    .fn()
    .mockResolvedValue(new MonitorPlanReportingFrequency()),
  findBy: jest.fn().mockResolvedValue([new MonitorPlanReportingFrequency()]),
});

const mockUscMap = () => ({
  many: jest.fn().mockResolvedValue([]),
});
const mockCountyCodeService = () => ({
  getCountyCode: jest.fn().mockResolvedValue(new CountyCodeDTO()),
});
const mockMap = () => ({
  one: jest.fn().mockResolvedValue(DTO),
  many: jest.fn().mockResolvedValue([DTO]),
});
const mockReportingPeriodRepo = () => ({
  getByDate: jest.fn().mockResolvedValue({ year: 1, quarter: 1 }),
  getByYearQuarter: jest.fn().mockResolvedValue({ year: 1, quarter: 1 }),
  getById: jest.fn().mockResolvedValue({ year: 1, quarter: 1 }),
  getNextReportingPeriodId: jest.fn().mockResolvedValue(1),
  getPreviousPeriodId: jest.fn(),
});
const mockUnitProgramRepo = () => ({
  getUnitProgramsByUnitIds: jest.fn().mockResolvedValue([]),
});
const mockMonitorPlanLocationService = () => ({
  createMonPlanLocationRecord: jest.fn(),
});
const queryBuilderMock = {
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(['your_mocked_object_here']),
};
const entityManagerMock = {
  connection: {
    createQueryRunner: jest.fn().mockImplementation(() => queryRunnerMock),
  },
  createQueryBuilder: () => queryBuilderMock,
  transaction: jest.fn(
    async passedFunction => await passedFunction(entityManagerMock),
  ),
};
const queryRunnerMock = {
  manager: entityManagerMock,
  commitTransaction: jest.fn(),
  release: jest.fn(),
  rollbackTransaction: jest.fn(),
  startTransaction: jest.fn(),
};

describe('Monitor Plan Service', () => {
  let service: MonitorPlanWorkspaceService;

  beforeEach(async () => {
    // initialize a NestJS module with service and relevant repositories.
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: EntityManager,
          useFactory: () => entityManagerMock,
        },
        MonitorPlanWorkspaceService,
        {
          provide: EaseyContentService,
          useFactory: mockEaseyContentService,
        },
        {
          provide: PlantService,
          useFactory: mockPlantService,
        },
        {
          provide: MonitorLocationWorkspaceService,
          useFactory: mockMonitorLocationService,
        },
        {
          provide: MonitorPlanWorkspaceRepository,
          useFactory: mockMonitorPlanRepo,
        },
        {
          provide: MonitorPlanCommentWorkspaceService,
          useFactory: mockMonitorPlanCommentService,
        },
        {
          provide: UnitStackConfigurationWorkspaceService,
          useFactory: mockUnitStackConfigService,
        },
        {
          provide: MonitorLocationWorkspaceRepository,
          useFactory: mockMonitorLocationRepo,
        },
        {
          provide: MonitorPlanCommentWorkspaceRepository,
          useFactory: mockCommentRepo,
        },
        {
          provide: MonitorAttributeWorkspaceRepository,
          useFactory: mockAttributeRepo,
        },
        {
          provide: MonitorMethodWorkspaceRepository,
          useFactory: mockMethodRepo,
        },
        {
          provide: MatsMethodWorkspaceRepository,
          useFactory: mockMatsMethodRepo,
        },
        {
          provide: MonitorFormulaWorkspaceRepository,
          useFactory: mockFormulaRepo,
        },
        {
          provide: MonitorDefaultWorkspaceRepository,
          useFactory: mockDefaultRepo,
        },
        {
          provide: MonitorSpanWorkspaceRepository,
          useFactory: mockSpanRepo,
        },
        {
          provide: DuctWafWorkspaceRepository,
          useFactory: mockDuctWafRepo,
        },
        {
          provide: MonitorLoadWorkspaceRepository,
          useFactory: mockLoadRepo,
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockComponentRepo,
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockSystemRepo,
        },
        {
          provide: UnitCapacityWorkspaceRepository,
          useFactory: mockUnitCapacityRepo,
        },
        {
          provide: UnitControlWorkspaceRepository,
          useFactory: mockUnitControlRepo,
        },
        {
          provide: UnitFuelWorkspaceRepository,
          useFactory: mockUnitFuelRepo,
        },
        {
          provide: MonitorQualificationWorkspaceRepository,
          useFactory: mockQualificationRepo,
        },
        {
          provide: SystemFuelFlowWorkspaceRepository,
          useFactory: mockSystemFuelFlowRepo,
        },
        {
          provide: SystemComponentWorkspaceRepository,
          useFactory: mockSystemComponentRepo,
        },
        {
          provide: AnalyzerRangeWorkspaceRepository,
          useFactory: mockAnalyzerRangeRepo,
        },
        {
          provide: LEEQualificationWorkspaceRepository,
          useFactory: mockLeeQualificationRepo,
        },
        {
          provide: LMEQualificationWorkspaceRepository,
          useFactory: mockLmeQualificationRepo,
        },
        {
          provide: PCTQualificationWorkspaceRepository,
          useFactory: mockPctQualificationRepo,
        },
        {
          provide: UnitStackConfigurationWorkspaceRepository,
          useFactory: mockUnitStackConfigRepo,
        },
        {
          provide: MonitorPlanReportingFrequencyWorkspaceRepository,
          useFactory: mockReportingFreqRepo,
        },
        {
          provide: UnitStackConfigurationMap,
          useFactory: mockUscMap,
        },
        {
          provide: CountyCodeService,
          useFactory: mockCountyCodeService,
        },
        {
          provide: MonitorPlanMap,
          useFactory: mockMap,
        },
        {
          provide: EvalStatusCodeRepository,
          useFactory: mockEvalStatusCodeRepo,
        },
        {
          provide: SubmissionsAvailabilityStatusCodeRepository,
          useFactory: mockSubmissionAvailabilityCodeRepo,
        },
        {
          provide: ReportingPeriodRepository,
          useFactory: mockReportingPeriodRepo,
        },
        {
          provide: UnitProgramRepository,
          useFactory: mockUnitProgramRepo,
        },
        {
          provide: MonitorPlanLocationService,
          useFactory: mockMonitorPlanLocationService,
        },
        {
          provide: UnitWorkspaceService,
          useFactory: mockUnitService,
        },
      ],
    }).compile();

    service = module.get<MonitorPlanWorkspaceService>(
      MonitorPlanWorkspaceService,
    );
  });

  describe('importMpPlan', () => {
    it('Should import a MonitoringPlan', async () => {
      jest
        .spyOn(service as any, 'calculateReportPeriodRangeFromLocations')
        .mockResolvedValue([1, 1]);
      jest.spyOn(service, 'updateEndReportingPeriod').mockResolvedValue(DTO);
      const result = await service.importMpPlan(UPDATE_DTO, USER_ID);
      expect(result).toEqual({
        endedPlans: [DTO],
        newPlan: null,
        unchangedPlans: [],
      });
    });
  });

  describe('revertToOfficialRecord', () => {
    it('Should call revertToOfficialRecord on repository', async () => {
      const result = await service.revertToOfficialRecord(MON_PLAN_ID);
    });
  });

  describe('getMonitorPlan', () => {
    it('Return a MonitorPlanDTO mapped from an Entity retrieved by ID', async () => {
      const result = await service.getMonitorPlan(MON_PLAN_ID);
      expect(result).toEqual(DTO);
    });
  });

  describe('updateDateAndUserId', () => {
    it('Should call updateDateAndUserId on the repo', async () => {
      const result = await service.updateDateAndUserId(MON_PLAN_ID, USER_ID);
    });
  });

  describe('resetToNeedsEvaluation', () => {
    it('Should call resetToNeedsEvaluation on repo', async () => {
      const result = await service.resetToNeedsEvaluation(LOC_ID, USER_ID);
    });
  });

  describe('exportMonitorPlan', () => {
    it('', async () => {
      const result = await service.exportMonitorPlan(
        MON_PLAN_ID,
        true,
        true,
        true,
        true,
      );
    });
  });
});
