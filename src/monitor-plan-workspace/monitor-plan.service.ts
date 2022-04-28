import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MPEvaluationReportDTO } from '../dtos/mp-evaluation-report.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
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
import { UpdateMonitorPlanDTO } from 'src/dtos/monitor-plan-update.dto';
import { ComponentWorkspaceService } from 'src/component-workspace/component.service';

import {
  getMonLocId,
  getFacIdFromOris,
} from '../import-checks/utilities/utils';
import { StackPipe } from 'src/entities/workspace/stack-pipe.entity';
import { Unit } from 'src/entities/workspace/unit.entity';
import { UnitStackConfiguration } from 'src/entities/workspace/unit-stack-configuration.entity';
import { UnitStackConfigurationRepository } from 'src/unit-stack-configuration/unit-stack-configuration.repository';
import { UnitCapacityWorkspaceService } from 'src/unit-capacity-workspace/unit-capacity.service';
import { UnitControlWorkspaceService } from 'src/unit-control-workspace/unit-control.service';
import { UnitFuelWorkspaceService } from 'src/unit-fuel-workspace/unit-fuel.service';

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
    @InjectRepository(UnitStackConfigurationRepository)
    private readonly unitStackConfigRepository: UnitStackConfigurationRepository,
    private readonly countyCodeService: CountyCodeService,
    private readonly mpReportResultService: MonitorPlanReportResultService,

    private readonly componentService: ComponentWorkspaceService,
    private readonly unitCapacityService: UnitCapacityWorkspaceService,
    private readonly unitControlService: UnitControlWorkspaceService,
    private readonly unitFuelService: UnitFuelWorkspaceService,

    private map: MonitorPlanMap,
  ) {}

  async importMpPlan(
    plan: UpdateMonitorPlanDTO,
    userId: string,
  ): Promise<MonitorPlanDTO> {
    const entityManager = getManager();
    const promises = [];

    const updateDate: Date = new Date();
    const facilityId = await getFacIdFromOris(plan.orisCode);

    // Unit Stack Config Merge Logic
    for (const unitStackConfig of plan.unitStackConfiguration) {
      promises.push(
        new Promise(async () => {
          const stackPipe = await entityManager.findOne(StackPipe, {
            name: unitStackConfig.stackPipeId,
            facId: facilityId,
          });

          const unit = await entityManager.findOne(Unit, {
            name: unitStackConfig.unitId,
            facId: facilityId,
          });

          const unitStackCongigRecord = await entityManager.findOne(
            UnitStackConfiguration,
            {
              unitId: unit.id,
              stackPipeId: stackPipe.id,
            },
          );
          if (
            unitStackConfig.beginDate != unitStackCongigRecord.beginDate ||
            unitStackConfig.endDate != unitStackCongigRecord.endDate
          ) {
            unitStackCongigRecord.updateDate = updateDate;
            unitStackCongigRecord.beginDate = unitStackConfig.beginDate;
            unitStackConfig.endDate = unitStackConfig.endDate;
            unitStackCongigRecord.userId = userId;

            await this.unitStackConfigRepository.update(
              unitStackCongigRecord,
              unitStackCongigRecord,
            );
          }
        }),
      );
    }

    for (const location of plan.locations) {
      const unitRecord = await entityManager.findOne(Unit, {
        name: location.unitId,
        facId: facilityId,
      });

      const MonitorLocation = await getMonLocId(
        location,
        facilityId,
        plan.orisCode,
      );

      // Component Merge Logic
      promises.push(
        new Promise(() => {
          for (const component of location.components) {
            this.componentService.createComponent(
              MonitorLocation.id,
              component,
              userId,
            );
          }
        }),
      );

      // Unit Merge Logic
      promises.push(
        new Promise(async () => {
          unitRecord.nonLoadBasedIndicator = location.nonLoadBasedIndicator;
          await entityManager.update(Unit, unitRecord, unitRecord);
        }),
      );

      //Unit Capacity Merge Logic
      for (const unitCapacity of location.unitCapacity) {
        promises.push(
          new Promise(async () => {
            const unitCapacityRecord = await this.unitCapacityRepository.getUnitCapacityByUnitIdAndDate(
              unitRecord.id,
              unitCapacity.beginDate,
              unitCapacity.endDate,
            );

            if (unitCapacityRecord != null) {
              this.unitCapacityService.updateUnitCapacity(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitCapacityRecord.id,
                unitCapacity,
              );
            } else {
              this.unitCapacityService.createUnitCapacity(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitCapacity,
              );
            }
          }),
        );
      }

      //Unit Control Merge Logic
      for (const unitControl of location.unitControls) {
        promises.push(
          new Promise(async () => {
            const unitControlRecord = await this.unitControlRepository.getUnitControlBySpecs(
              unitRecord.id,
              unitControl.controlEquipParamCode,
              unitControl.controlCode,
              unitControl.installDate,
              unitControl.retireDate,
            );

            if (unitControlRecord != null) {
              this.unitControlService.updateUnitControl(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitControlRecord.id,
                unitControl,
              );
            } else {
              this.unitControlService.createUnitControl(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitControl,
              );
            }
          }),
        );
      }

      //Unit Fuel Merge Logic
      for (const unitFuel of location.unitFuels) {
        promises.push(
          new Promise(async () => {
            const unitFuelRecord = await this.unitFuelRepository.getUnitFuelBySpecs(
              unitRecord.id,
              unitFuel.fuelCode,
              unitFuel.beginDate,
              unitFuel.endDate,
            );

            if (unitFuelRecord != null) {
              this.unitFuelService.updateUnitFuel(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitFuelRecord.id,
                unitFuel,
              );
            } else {
              this.unitFuelService.createUnitFuel(
                userId,
                MonitorLocation.id,
                unitRecord.id,
                unitFuel,
              );
            }
          }),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.repository.getMonitorPlansByOrisCode(orisCode);

    if (plans.length === 0) {
      return [];
    }

    const locations = await this.locationRepository.getMonitorLocationsByFacId(
      plans[0].facId,
    );
    plans.forEach(p => {
      const matchedLocations: MonitorLocation[] = [];
      locations.forEach(l => {
        const planIds = l.plans.map(lp => lp.id);
        if (planIds.includes(p.id)) {
          matchedLocations.push(l);
        }
      });
      p.locations = matchedLocations;
    });
    const results = await this.map.many(plans);
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

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    return this.repository.revertToOfficialRecord(monPlanId);
  }

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(monPlanId);
    const mpDTO = new MonitorPlanDTO();
    mpDTO.id = mp.id;
    mpDTO.updateDate = mp.updateDate;
    mpDTO.userId = mp.userId;
    mpDTO.evalStatusCode = mp.evalStatusCode;
    mpDTO.facId = mp.facId;
    return mpDTO;
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
    const plan = await this.repository.getActivePlanByLocation(locId);
    const planId = plan.id;

    await this.repository.resetToNeedsEvaluation(planId, userId);
  }

  async exportMonitorPlan(planId: string): Promise<MonitorPlanDTO> {
    const promises = [];

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

    const COMMENTS = 0;
    promises.push(this.commentRepository.find({ monitorPlanId: planId }));

    const UNIT_CAPACITIES = COMMENTS + 1;
    promises.push(
      this.unitCapacityRepository.getUnitCapacitiesByUnitIds(unitIds),
    );

    const UNIT_CONTROLS = UNIT_CAPACITIES + 1;
    promises.push(
      this.unitControlRepository.find({ where: { unitId: In(unitIds) } }),
    );

    const UNIT_FUEL = UNIT_CONTROLS + 1;
    promises.push(
      this.unitFuelRepository.find({ where: { unitId: In(unitIds) } }),
    );

    const ATTRIBUTES = UNIT_FUEL + 1;
    promises.push(
      this.attributeRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const METHODS = ATTRIBUTES + 1;
    promises.push(
      this.methodRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const MATS_METHODS = METHODS + 1;
    promises.push(
      this.matsMethodRepository.find({
        where: { locationId: In(locationIds) },
      }),
    );

    const FORMULAS = MATS_METHODS + 1;
    promises.push(
      this.formulaRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const DEFAULTS = FORMULAS + 1;
    promises.push(
      this.defaultRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const SPANS = DEFAULTS + 1;
    promises.push(
      this.spanRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const DUCT_WAFS = SPANS + 1;
    promises.push(
      this.ductWafRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const LOADS = DUCT_WAFS + 1;
    promises.push(
      this.loadRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const COMPONENTS = LOADS + 1;
    promises.push(
      this.componentRepository.find({ where: { locationId: In(locationIds) } }),
    );

    const SYSTEMS = COMPONENTS + 1;
    promises.push(
      new Promise(async (resolve, reject) => {
        const systems = await this.systemRepository.find({
          where: { locationId: In(locationIds) },
        });

        const systemIds = systems.map(i => i.id);
        const s1 = this.systemFuelFlowRepository.getFuelFlowsBySystemIds(
          systemIds,
        );
        const s2 = this.systemComponentRepository.getComponentsBySystemIds(
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

        resolve(systems);
      }),
    );

    const QUALIFICATIONS = SYSTEMS + 1;
    promises.push(
      new Promise(async (resolve, reject) => {
        const quals = await this.qualificationRepository.find({
          where: { locationId: In(locationIds) },
        });

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

        resolve(quals);
      }),
    );

    const results = await Promise.all(promises);
    mp.comments = results[COMMENTS];

    mp.locations.forEach(l => {
      const locationId = l.id;

      if (l.unit) {
        const unitId = l.unit.id;

        l.unit.unitCapacities = results[UNIT_CAPACITIES].filter(
          i => i.unitId === unitId,
        );
        l.unit.unitControls = results[UNIT_CONTROLS].filter(
          i => i.unitId === unitId,
        );
        l.unit.unitFuels = results[UNIT_FUEL].filter(i => i.unitId === unitId);
      }

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
      l.ductWafs = results[DUCT_WAFS].filter(i => i.locationId === locationId);
      l.loads = results[LOADS].filter(i => i.locationId === locationId);
      l.components = results[COMPONENTS].filter(
        i => i.locationId === locationId,
      );
      l.systems = results[SYSTEMS].filter(i => i.locationId === locationId);
      l.qualifications = results[QUALIFICATIONS].filter(
        i => i.locationId === locationId,
      );
    });

    return this.map.one(mp);
  }
}
