import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MPEvaluationReportDTO } from '../dtos/mp-evaluation-report.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { CountyCodeService } from '../county-code/county-code.service';
import { MonitorPlanReportResultService } from '../monitor-plan-report-result/monitor-plan-report-result.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanCommentWorkspaceRepository } from '../monitor-plan-comment-workspace/monitor-plan-comment.repository';
import { MonitorAttributeWorkspaceRepository } from '../monitor-attribute-workspace/monitor-attribute.repository';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method.repository';
import { MatsMethodWorkspaceRepository } from '../mats-method-workspace/mats-method.repository';
import { MonitorFormulaWorkspaceRepository } from '../monitor-formula-workspace/monitor-formula.repository';
import { MonitorDefaultWorkspaceRepository } from '../monitor-default-workspace/monitor-default.repository';
import { MonitorSpanWorkspaceRepository } from '../monitor-span-workspace/monitor-span.repository';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { MonitorLoadWorkspaceRepository } from '../monitor-load-workspace/monitor-load.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system.repository';
import { UnitCapacityWorkspaceRepository } from '../unit-capacity-workspace/unit-capacity.repository';
import { MonitorQualificationWorkspaceRepository } from '../monitor-qualification-workspace/monitor-qualification.repository';
import { SystemFuelFlowWorkspaceRepository } from '../system-fuel-flow-workspace/system-fuel-flow.repository';
import { SystemComponentWorkspaceRepository } from '../system-component-workspace/system-component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { LEEQualificationWorkspaceRepository } from '../lee-qualification-workspace/lee-qualification.repository';
import { LMEQualificationWorkspaceRepository } from '../lme-qualification-workspace/lme-qualification.repository';
import { PCTQualificationWorkspaceRepository } from '../pct-qualification-workspace/pct-qualification.repository';
import { UnitControlWorkspaceRepository } from '../unit-control-workspace/unit-control.repository';
import { UnitFuelWorkspaceRepository } from '../unit-fuel-workspace/unit-fuel.repository';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorPlanCommentWorkspaceService } from '../monitor-plan-comment-workspace/monitor-plan-comment.service';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { PlantService } from '../plant/plant.service';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.repository';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private readonly repository: MonitorPlanWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly locationRepository: MonitorLocationWorkspaceRepository,
    @InjectRepository(MonitorPlanCommentWorkspaceRepository)
    private readonly commentRepository: MonitorPlanCommentWorkspaceRepository,
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private readonly attributeRepository: MonitorAttributeWorkspaceRepository,
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private readonly methodRepository: MonitorMethodWorkspaceRepository,
    @InjectRepository(MatsMethodWorkspaceRepository)
    private readonly matsMethodRepository: MatsMethodWorkspaceRepository,
    @InjectRepository(MonitorFormulaWorkspaceRepository)
    private readonly formulaRepository: MonitorFormulaWorkspaceRepository,
    @InjectRepository(MonitorDefaultWorkspaceRepository)
    private readonly defaultRepository: MonitorDefaultWorkspaceRepository,
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly spanRepository: MonitorSpanWorkspaceRepository,
    @InjectRepository(DuctWafWorkspaceRepository)
    private readonly ductWafRepository: DuctWafWorkspaceRepository,
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private readonly loadRepository: MonitorLoadWorkspaceRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly systemRepository: MonitorSystemWorkspaceRepository,
    @InjectRepository(UnitCapacityWorkspaceRepository)
    private readonly unitCapacityRepository: UnitCapacityWorkspaceRepository,
    @InjectRepository(UnitControlWorkspaceRepository)
    private readonly unitControlRepository: UnitControlWorkspaceRepository,
    @InjectRepository(UnitFuelWorkspaceRepository)
    private readonly unitFuelRepository: UnitFuelWorkspaceRepository,
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private readonly qualificationRepository: MonitorQualificationWorkspaceRepository,
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly systemFuelFlowRepository: SystemFuelFlowWorkspaceRepository,
    @InjectRepository(SystemComponentWorkspaceRepository)
    private readonly systemComponentRepository: SystemComponentWorkspaceRepository,
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private readonly analyzerRangeRepository: AnalyzerRangeWorkspaceRepository,
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private readonly leeQualificationRepository: LEEQualificationWorkspaceRepository,
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private readonly lmeQualificationRepository: LMEQualificationWorkspaceRepository,
    @InjectRepository(PCTQualificationWorkspaceRepository)
    private readonly pctQualificationRepository: PCTQualificationWorkspaceRepository,
    @InjectRepository(UnitStackConfigurationWorkspaceRepository)
    private readonly unitStackConfigRepository: UnitStackConfigurationWorkspaceRepository,
    @InjectRepository(MonitorPlanReportingFrequencyWorkspaceRepository)
    private readonly reportingFreqRepository: MonitorPlanReportingFrequencyWorkspaceRepository,

    private readonly plantService: PlantService,
    private readonly uscMap: UnitStackConfigurationMap,
    private readonly countyCodeService: CountyCodeService,
    private readonly mpReportResultService: MonitorPlanReportResultService,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly monitorPlanCommentService: MonitorPlanCommentWorkspaceService,

    private map: MonitorPlanMap,
  ) {}

  async importMpPlan(
    plan: MonitorPlanDTO,
    userId: string,
  ): Promise<MonitorPlanDTO> {
    const promises = [];
    const facilityId = await this.plantService.getFacIdFromOris(plan.orisCode);

    const locations = await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
      plan,
      facilityId,
      plan.orisCode,
    );

    const locationIds = locations.map(l => l.id);

    // Get Active Plan
    let activePlanId: string;

    // Get active plan
    const activePlan = await this.repository.getActivePlanByLocationId(
      locationIds[0],
    );

    activePlanId = activePlan.id;

    // Monitor Plan Comment Merge Logic
    promises.push(
      this.monitorPlanCommentService.importComments(plan, userId, activePlanId),
    );

    //Unit Stack Merge Logic
    promises.push(
      this.unitStackService.importUnitStack(plan, facilityId, userId),
    );

    //Monitor Location Merge Logic
    promises.push(
      this.monitorLocationService.importMonitorLocation(
        plan,
        facilityId,
        userId,
      ),
    );

    await Promise.all(promises);

    await this.resetToNeedsEvaluation(locationIds[0], userId);

    return null;
  }

  private async parseMonitorPlanConfigurations(plans: MonitorPlan[]) {
    if (plans.length === 0) {
      return [];
    }
    const results = await this.map.many(plans);

    for (const p of results) {
      const monPlan = await this.exportMonitorPlan(
        p.id,
        false,
        false,
        false,
        true,
      );
      p.name = monPlan.name;
      p.locations = monPlan.locations;
      p.unitStackConfigurations = monPlan.unitStackConfigurations;
      p.locations.forEach(l => {
        delete l.attributes;
        delete l.unitCapacities;
        delete l.unitControls;
        delete l.unitFuels;
        delete l.methods;
        delete l.matsMethods;
        delete l.formulas;
        delete l.defaults;
        delete l.spans;
        delete l.ductWafs;
        delete l.loads;
        delete l.components;
        delete l.systems;
        delete l.qualifications;
      });
      delete p.comments;
      delete p.reportingFrequencies;
    }
    results.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });
    return results;
  }

  async getConfigurationsByOris(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.repository.getMonitorPlansByOrisCode(orisCode);
    return this.parseMonitorPlanConfigurations(plans);
  }

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    return this.repository.revertToOfficialRecord(monPlanId);
  }

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(monPlanId);
    return this.map.one(mp);
  }

  async updateDateAndUserId(monPlanId: string, userId: string): Promise<void> {
    return this.repository.updateDateAndUserId(monPlanId, userId);
  }

  async getEvaluationReport(planId: string) {
    const mpEvalReport: MPEvaluationReportDTO = new MPEvaluationReportDTO();

    const mp = await this.repository.getMonitorPlan(planId);

    const county = await this.countyCodeService.getCountyCode(
      mp.plant.countyCode,
    );

    const mpReportResults = await this.mpReportResultService.getMPReportResults(
      planId,
    );

    mpEvalReport.facilityName = mp.plant.name;
    mpEvalReport.facilityId = mp.plant.orisCode;
    mpEvalReport.state = county.stateCode;
    mpEvalReport.countyName = county.countyName;
    mpEvalReport.mpReportResults = mpReportResults;

    return mpEvalReport;
  }

  async resetToNeedsEvaluation(locId: string, userId: string): Promise<void> {
    const plan = await this.repository.getActivePlanByLocationId(locId);

    const planId = plan.id;

    await this.repository.resetToNeedsEvaluation(planId, userId);
  }

  async exportMonitorPlan(
    planId: string,
    getLocChildRecords: boolean = true,
    getReportingFrquencies: boolean = true,
    getComments: boolean = true,
    getUnitStacks: boolean = true,
  ): Promise<MonitorPlanDTO> {
    const promises = [];
    let REPORTING_FREQ,
      COMMENTS,
      UNIT_STACK_CONFIGS,
      UNIT_CAPACITIES,
      UNIT_CONTROLS,
      UNIT_FUEL,
      ATTRIBUTES,
      METHODS,
      MATS_METHODS,
      FORMULAS,
      DEFAULTS,
      SPANS,
      DUCT_WAFS,
      LOADS,
      COMPONENTS,
      SYSTEMS,
      QUALIFICATIONS;

    const mp = await this.repository.getMonitorPlan(planId);
    mp.locations = await this.locationRepository.getMonitorLocationsByPlanId(
      planId,
    );

    const identifiers = mp.locations.map(l => {
      return {
        locationId: l.id,
        unitId: l.unit ? l.unit.id : null,
        stackPipeId: l.stackPipe ? l.stackPipe.id : null,
      };
    });

    const locationIds = identifiers.map(i => i.locationId);
    const unitIds = identifiers
      .filter(i => i.unitId !== null)
      .map(i => i.unitId);
    if (getReportingFrquencies) {
      REPORTING_FREQ = 0;
      promises.push(
        this.reportingFreqRepository.find({ monitorPlanId: planId }),
      );
    }

    if (getComments) {
      COMMENTS = getReportingFrquencies === true ? REPORTING_FREQ + 1 : 0;
      promises.push(this.commentRepository.find({ monitorPlanId: planId }));
    }

    if (getUnitStacks) {
      if (getComments === true) {
        UNIT_STACK_CONFIGS = COMMENTS + 1;
      } else if (getComments === false && getReportingFrquencies === true) {
        UNIT_STACK_CONFIGS = REPORTING_FREQ + 1;
      } else {
        UNIT_STACK_CONFIGS = 0;
      }

      promises.push(
        this.unitStackConfigRepository.getUnitStackConfigsByLocationIds(
          locationIds,
        ),
      );
    }

    if (getLocChildRecords) {
      if (getUnitStacks === true) {
        UNIT_CAPACITIES = UNIT_STACK_CONFIGS + 1;
      } else if (getComments === true && getUnitStacks === false) {
        UNIT_CAPACITIES = COMMENTS + 1;
      } else if (
        getReportingFrquencies === true &&
        getComments === false &&
        getUnitStacks === false
      ) {
        UNIT_CAPACITIES = REPORTING_FREQ + 1;
      } else {
        UNIT_CAPACITIES = 0;
      }

      promises.push(
        this.unitCapacityRepository.getUnitCapacitiesByUnitIds(unitIds),
      );

      UNIT_CONTROLS = UNIT_CAPACITIES + 1;
      promises.push(
        this.unitControlRepository.find({ where: { unitId: In(unitIds) } }),
      );

      UNIT_FUEL = UNIT_CONTROLS + 1;
      promises.push(
        this.unitFuelRepository.find({ where: { unitId: In(unitIds) } }),
      );

      ATTRIBUTES = UNIT_FUEL + 1;
      promises.push(
        this.attributeRepository.find({
          where: { locationId: In(locationIds) },
        }),
      );

      METHODS = ATTRIBUTES + 1;
      promises.push(
        this.methodRepository.find({ where: { locationId: In(locationIds) } }),
      );

      MATS_METHODS = METHODS + 1;
      promises.push(
        this.matsMethodRepository.find({
          where: { locationId: In(locationIds) },
        }),
      );

      FORMULAS = MATS_METHODS + 1;
      promises.push(
        this.formulaRepository.find({ where: { locationId: In(locationIds) } }),
      );

      DEFAULTS = FORMULAS + 1;
      promises.push(
        this.defaultRepository.find({ where: { locationId: In(locationIds) } }),
      );

      SPANS = DEFAULTS + 1;
      promises.push(
        this.spanRepository.find({ where: { locationId: In(locationIds) } }),
      );

      DUCT_WAFS = SPANS + 1;
      promises.push(
        this.ductWafRepository.find({ where: { locationId: In(locationIds) } }),
      );

      LOADS = DUCT_WAFS + 1;
      promises.push(
        this.loadRepository.find({ where: { locationId: In(locationIds) } }),
      );

      COMPONENTS = LOADS + 1;
      promises.push(
        new Promise(async (resolve, reject) => {
          const components = await this.componentRepository.find({
            where: { locationId: In(locationIds) },
          });
          if (components.length !== 0) {
            const componentIds = components.map(i => i.id);

            const analyzerRanges = this.analyzerRangeRepository.getAnalyzerRangesByCompIds(
              componentIds,
            );

            const rangeResults = await Promise.all([analyzerRanges]);

            components.forEach(async c => {
              c.analyzerRanges = rangeResults[0].filter(
                i => i.componentRecordId === c.id,
              );
            });
          }

          resolve(components);
        }),
      );

      SYSTEMS = COMPONENTS + 1;
      promises.push(
        new Promise(async (resolve, reject) => {
          const systems = await this.systemRepository.find({
            where: { locationId: In(locationIds) },
          });

          if (systems.length !== 0) {
            const systemIds = systems.map(i => i.id);
            const s1 = this.systemFuelFlowRepository.getFuelFlowsBySystemIds(
              systemIds,
            );
            const s2 = this.systemComponentRepository.getSystemComponentsBySystemIds(
              systemIds,
            );

            const sysResults = await Promise.all([s1, s2]);

            systems.forEach(async s => {
              s.fuelFlows = sysResults[0].filter(
                i => i.monitoringSystemRecordId === s.id,
              );
              s.components = sysResults[1].filter(
                i => i.monitoringSystemRecordId === s.id,
              );
            });
          }

          resolve(systems);
        }),
      );

      QUALIFICATIONS = SYSTEMS + 1;
      promises.push(
        new Promise(async (resolve, reject) => {
          const quals = await this.qualificationRepository.find({
            where: { locationId: In(locationIds) },
          });

          if (quals.length !== 0) {
            const qualIds = quals.map(i => i.id);
            const q1 = this.leeQualificationRepository.find({
              where: { qualificationId: In(qualIds) },
            });
            const q2 = this.lmeQualificationRepository.find({
              where: { qualificationId: In(qualIds) },
            });
            const q3 = this.pctQualificationRepository.find({
              where: { qualificationId: In(qualIds) },
            });

            const qualResults = await Promise.all([q1, q2, q3]);

            quals.forEach(async q => {
              q.leeQualifications = qualResults[0].filter(
                i => i.qualificationId === q.id,
              );
              q.lmeQualifications = qualResults[1].filter(
                i => i.qualificationId === q.id,
              );
              q.pctQualifications = qualResults[2].filter(
                i => i.qualificationId === q.id,
              );
            });
          }

          resolve(quals);
        }),
      );
    }

    const results = await Promise.all(promises);

    if (getComments) {
      mp.comments = results[COMMENTS];
    }

    if (getReportingFrquencies) {
      mp.reportingFrequencies = results[REPORTING_FREQ];
    }

    mp.locations.forEach(l => {
      const locationId = l.id;

      if (l.unit) {
        const unitId = l.unit.id;
        if (getLocChildRecords) {
          l.unit.unitCapacities = results[UNIT_CAPACITIES].filter(
            i => i.unitId === unitId,
          );
          l.unit.unitControls = results[UNIT_CONTROLS].filter(
            i => i.unitId === unitId,
          );
          l.unit.unitFuels = results[UNIT_FUEL].filter(
            i => i.unitId === unitId,
          );
        }
      }
      if (getLocChildRecords) {
        l.attributes = results[ATTRIBUTES].filter(
          i => i.locationId === locationId,
        );
        l.methods = results[METHODS].filter(i => i.locationId === locationId);
        l.matsMethods = results[MATS_METHODS].filter(
          i => i.locationId === locationId,
        );
        l.formulas = results[FORMULAS].filter(i => i.locationId === locationId);
        l.defaults = results[DEFAULTS].filter(i => i.locationId === locationId);
        l.spans = results[SPANS].filter(i => i.locationId === locationId);
        l.ductWafs = results[DUCT_WAFS].filter(
          i => i.locationId === locationId,
        );
        l.loads = results[LOADS].filter(i => i.locationId === locationId);
        l.components = results[COMPONENTS].filter(
          i => i.locationId === locationId,
        );
        l.systems = results[SYSTEMS].filter(i => i.locationId === locationId);
        l.qualifications = results[QUALIFICATIONS].filter(
          i => i.locationId === locationId,
        );
      }
    });

    const mpDTO = await this.map.one(mp);

    if (getUnitStacks && results[UNIT_STACK_CONFIGS]) {
      const uscDTO = await this.uscMap.many(results[UNIT_STACK_CONFIGS]);
      mpDTO.unitStackConfigurations = uscDTO;
    }

    return mpDTO;
  }
}
