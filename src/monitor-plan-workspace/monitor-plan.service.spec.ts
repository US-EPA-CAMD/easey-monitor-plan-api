import { Test } from '@nestjs/testing';

import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CountyCodeService } from '../county-code/county-code.service';
import { CPMSQualificationWorkspaceRepository } from '../cpms-qualification-workspace/cpms-qualification-workspace.repository';
import { CountyCodeDTO } from '../dtos/county-code.dto';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
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

const USER_ID = 'USER_ID';
const FAC_ID = 'FAC_ID';
const LOC_ID = 'LOC_ID';
const MON_PLAN_ID = 'MON_PLAN_ID';
const DTO = new UpdateMonitorPlanDTO();
const MONITOR_LOCATION = new MonitorLocation();
MONITOR_LOCATION.id = LOC_ID;
const MONITOR_PLAN = new MonitorPlan();
MONITOR_PLAN.plant = new Plant();

const mockPlantService = () => ({
  getFacIdFromOris: jest.fn().mockResolvedValue(FAC_ID),
});

const mockMonitorLocationService = () => ({
  getMonitorLocationsByFacilityAndOris: jest
    .fn()
    .mockResolvedValue([MONITOR_LOCATION]),
  importMonitorLocation: jest.fn(),
});

const mockMonitorPlanRepo = () => ({
  getActivePlanByLocationId: jest.fn().mockResolvedValue(MONITOR_PLAN),
  resetToNeedsEvaluation: jest.fn(),
  revertToOfficialRecord: jest.fn(),
  getMonitorPlan: jest.fn().mockResolvedValue(MONITOR_PLAN),
  updateDateAndUserId: jest.fn(),
});

const mockMonitorPlanCommentService = () => ({
  importComments: jest.fn(),
});

const mockUnitStackConfigService = () => ({
  importUnitStack: jest.fn(),
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
  getUnitStackConfigsByLocationIds: jest.fn(),
});
const mockReportingFreqRepo = () => ({
  findBy: jest.fn().mockResolvedValue([new MonitorPlanReportingFrequency()]),
});

const mockCpmsQual = () => ({
  find: jest.fn().mockResolvedValue([new CPMSQualificationDTO()]),
});
const mockUscMap = () => ({});
const mockCountyCodeService = () => ({
  getCountyCode: jest.fn().mockResolvedValue(new CountyCodeDTO()),
});
const mockMap = () => ({
  one: jest.fn().mockResolvedValue(DTO),
  many: jest.fn().mockResolvedValue([DTO]),
});

describe('Monitor Plan Service', () => {
  let service: MonitorPlanWorkspaceService;

  beforeEach(async () => {
    // initialize a NestJS module with service and relevant repositories.
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanWorkspaceService,
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
          provide: CPMSQualificationWorkspaceRepository,
          useFactory: mockCpmsQual,
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
      ],
    }).compile();

    service = module.get<MonitorPlanWorkspaceService>(
      MonitorPlanWorkspaceService,
    );
  });

  describe('importMpPlan', () => {
    it('Should import a MonitoringPlan', async () => {
      const result = await service.importMpPlan(DTO, USER_ID);
      expect(result).toEqual(null);
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
