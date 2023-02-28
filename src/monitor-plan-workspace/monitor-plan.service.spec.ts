import { Test } from '@nestjs/testing';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import {MonitorPlanDTO} from "../dtos/monitor-plan.dto";
import {PlantService} from "../plant/plant.service";
import {MonitorLocationWorkspaceService} from "../monitor-location-workspace/monitor-location.service";
import {MonitorLocation} from "../entities/workspace/monitor-location.entity";
import {MonitorPlan} from "../entities/workspace/monitor-plan.entity";
import {MonitorPlanCommentWorkspaceService} from "../monitor-plan-comment-workspace/monitor-plan-comment.service";
import {
  UnitStackConfigurationWorkspaceService
} from "../unit-stack-configuration-workspace/unit-stack-configuration.service";
import {MonitorLocationWorkspaceRepository} from "../monitor-location-workspace/monitor-location.repository";
import {MonitorPlanCommentWorkspaceRepository} from "../monitor-plan-comment-workspace/monitor-plan-comment.repository";
import {MonitorAttributeWorkspaceRepository} from "../monitor-attribute-workspace/monitor-attribute.repository";
import {MonitorMethodWorkspaceRepository} from "../monitor-method-workspace/monitor-method.repository";
import {MatsMethodWorkspaceRepository} from "../mats-method-workspace/mats-method.repository";
import {MonitorFormulaWorkspaceRepository} from "../monitor-formula-workspace/monitor-formula.repository";
import {MonitorDefaultWorkspaceRepository} from "../monitor-default-workspace/monitor-default.repository";
import {MonitorSpanWorkspaceRepository} from "../monitor-span-workspace/monitor-span.repository";
import {DuctWafWorkspaceRepository} from "../duct-waf-workspace/duct-waf.repository";
import {MonitorLoadWorkspaceRepository} from "../monitor-load-workspace/monitor-load.repository";
import {ComponentWorkspaceRepository} from "../component-workspace/component.repository";
import {MonitorSystemWorkspaceRepository} from "../monitor-system-workspace/monitor-system.repository";
import {UnitCapacityWorkspaceRepository} from "../unit-capacity-workspace/unit-capacity.repository";
import {UnitControlWorkspaceRepository} from "../unit-control-workspace/unit-control.repository";
import {UnitFuelWorkspaceRepository} from "../unit-fuel-workspace/unit-fuel.repository";
import {
  MonitorQualificationWorkspaceRepository
} from "../monitor-qualification-workspace/monitor-qualification.repository";
import {SystemFuelFlowWorkspaceRepository} from "../system-fuel-flow-workspace/system-fuel-flow.repository";
import {SystemComponentWorkspaceRepository} from "../system-component-workspace/system-component.repository";
import {AnalyzerRangeWorkspaceRepository} from "../analyzer-range-workspace/analyzer-range.repository";
import {LEEQualificationWorkspaceRepository} from "../lee-qualification-workspace/lee-qualification.repository";
import {LMEQualificationWorkspaceRepository} from "../lme-qualification-workspace/lme-qualification.repository";
import {PCTQualificationWorkspaceRepository} from "../pct-qualification-workspace/pct-qualification.repository";
import {
  UnitStackConfigurationWorkspaceRepository
} from "../unit-stack-configuration-workspace/unit-stack-configuration.repository";
import {
  MonitorPlanReportingFrequencyWorkspaceRepository
} from "../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.repository";
import {UnitStackConfigurationMap} from "../maps/unit-stack-configuration.map";
import {CountyCodeService} from "../county-code/county-code.service";
import {MonitorPlanReportResultService} from "../monitor-plan-report-result/monitor-plan-report-result.service";
import {MonitorPlanMap} from "../maps/monitor-plan.map";
import {CountyCodeDTO} from "../dtos/county-code.dto";
import {MPEvaluationReportDTO} from "../dtos/mp-evaluation-report.dto";
import {Plant} from "../entities/workspace/plant.entity";
import {MonitorPlanComment} from "../entities/workspace/monitor-plan-comment.entity";
import {MonitorAttribute} from "../entities/workspace/monitor-attribute.entity";
import {MonitorMethod} from "../entities/workspace/monitor-method.entity";
import {MatsMethod} from "../entities/workspace/mats-method.entity";
import {MonitorFormula} from "../entities/workspace/monitor-formula.entity";
import {MonitorDefault} from "../entities/workspace/monitor-default.entity";
import {MonitorSpan} from "../entities/workspace/monitor-span.entity";
import {DuctWaf} from "../entities/workspace/duct-waf.entity";
import {MonitorLoad} from "../entities/workspace/monitor-load.entity";
import {Component} from "../entities/workspace/component.entity";
import {MonitorSystem} from "../entities/workspace/monitor-system.entity";
import {UnitControl} from "../entities/workspace/unit-control.entity";
import {UnitFuel} from "../entities/workspace/unit-fuel.entity";
import {MonitorQualification} from "../entities/workspace/monitor-qualification.entity";
import {MonitorPlanReportingFrequency} from "../entities/workspace/monitor-plan-reporting-freq.entity";
import {AnalyzerRange} from "../entities/workspace/analyzer-range.entity";
import {SystemFuelFlow} from "../entities/workspace/system-fuel-flow.entity";
import {SystemComponent} from "../entities/workspace/system-component.entity";
import {LEEQualification} from "../entities/workspace/lee-qualification.entity";
import {LMEQualification} from "../entities/workspace/lme-qualification.entity";
import {PCTQualification} from "../entities/workspace/pct-qualification.entity";

const USER_ID = 'USER_ID';
const FAC_ID = 'FAC_ID';
const LOC_ID = 'LOC_ID';
const MON_PLAN_ID = 'MON_PLAN_ID';
const DTO = new MonitorPlanDTO();
const MONITOR_LOCATION = new MonitorLocation();
MONITOR_LOCATION.id = LOC_ID;
const MONITOR_PLAN = new MonitorPlan();
MONITOR_PLAN.plant = new Plant();

const mockPlantService = () => ({
    getFacIdFromOris: jest.fn().mockResolvedValue(FAC_ID),
});

const mockMonitorLocationService = () => ({
  getMonitorLocationsByFacilityAndOris: jest.fn().mockResolvedValue([MONITOR_LOCATION]),
  importMonitorLocation: jest.fn(),
});

const mockMonitorPlanRepo = () => ({
  getActivePlanByLocationId: jest.fn().mockResolvedValue(MONITOR_PLAN),
  resetToNeedsEvaluation: jest.fn(),
  revertToOfficialRecord: jest.fn(),
  getMonitorPlan: jest.fn().mockResolvedValue(MONITOR_PLAN),
  updateDateAndUserId: jest.fn(),
})

const mockMonitorPlanCommentService = () => ({
  importComments: jest.fn(),
});

const mockUnitStackConfigService = () => ({
  importUnitStack: jest.fn(),
});

const mockMonitorLocationRepo = () => ({
  getMonitorLocationsByPlanId:
      jest.fn().mockResolvedValue([MONITOR_LOCATION]),
});
const mockCommentRepo = () => ({
  find: jest.fn().mockResolvedValue([new MonitorPlanComment()]),
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
  getSystemComponentsBySystemIds: jest.fn().mockResolvedValue([new SystemComponent()]),
});
const mockAnalyzerRangeRepo = () => ({
  getAnalyzerRangesByCompIds: jest.fn().mockResolvedValue([new AnalyzerRange()]),
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
  find: jest.fn().mockResolvedValue([new MonitorPlanReportingFrequency()]),
});
const mockUscMap = () => ({});
const mockCountyCodeService = () => ({
  getCountyCode: jest.fn().mockResolvedValue(new CountyCodeDTO()),
});
const mockMpReportResultService = () => ({
  getMPReportResults: jest.fn().mockResolvedValue([]),
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
          provide: MonitorPlanReportResultService,
          useFactory: mockMpReportResultService,
        },
        {
          provide: MonitorPlanMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<MonitorPlanWorkspaceService>(MonitorPlanWorkspaceService);
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
     }) ;
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

  describe('getEvaluationReport', () => {
    it('Should return and MPEvaluationReportDTO', async () => {
      const result = await service.getEvaluationReport(MON_PLAN_ID);
      expect(result).toBeInstanceOf(MPEvaluationReportDTO);
    });
  });

  describe('resetToNeedsEvaluation', () => {
    it('Should call resetToNeedsEvaluation on repo', async () => {
      const result = await service.resetToNeedsEvaluation(LOC_ID, USER_ID);
    });
  });

  describe('exportMonitorPlan', () => {
    it('', async () => {
      const result = await service.exportMonitorPlan(MON_PLAN_ID, true,
          true, true, true);
    });
  });

});
