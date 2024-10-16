import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { AnalyzerRangeRepository } from '../analyzer-range/analyzer-range.repository';
import { ComponentRepository } from '../component/component.repository';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { DuctWafRepository } from '../duct-waf/duct-waf.repository';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { LEEQualificationRepository } from '../lee-qualification/lee-qualification.repository';
import { LMEQualificationRepository } from '../lme-qualification/lme-qualification.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MatsMethodRepository } from '../mats-method/mats-method.repository';
import { MonitorAttributeRepository } from '../monitor-attribute/monitor-attribute.repository';
import { MonitorDefaultRepository } from '../monitor-default/monitor-default.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorLoadRepository } from '../monitor-load/monitor-load.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MonitorPlanCommentRepository } from '../monitor-plan-comment/monitor-plan-comment.repository';
import { MonitorPlanReportingFrequencyRepository } from '../monitor-plan-reporting-freq/monitor-plan-reporting-freq.repository';
import { MonitorQualificationRepository } from '../monitor-qualification/monitor-qualification.repository';
import { MonitorSpanRepository } from '../monitor-span/monitor-span.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { PCTQualificationRepository } from '../pct-qualification/pct-qualification.repository';
import { SystemComponentRepository } from '../system-component/system-component.repository';
import { SystemFuelFlowRepository } from '../system-fuel-flow/system-fuel-flow.repository';
import { UnitCapacityRepository } from '../unit-capacity/unit-capacity.repository';
import { UnitControlRepository } from '../unit-control/unit-control.repository';
import { UnitFuelRepository } from '../unit-fuel/unit-fuel.repository';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { removeNonReportedValues } from '../utilities/remove-non-reported-values';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { EaseyContentService } from '../monitor-plan-easey-content/easey-content.service';

@Injectable()
export class MonitorPlanService {
  constructor(
    private readonly repository: MonitorPlanRepository,
    private readonly commentRepository: MonitorPlanCommentRepository,
    private readonly locationRepository: MonitorLocationRepository,
    private readonly attributeRepository: MonitorAttributeRepository,
    private readonly methodRepository: MonitorMethodRepository,
    private readonly matsMethodRepository: MatsMethodRepository,
    private readonly formulaRepository: MonitorFormulaRepository,
    private readonly defaultRepository: MonitorDefaultRepository,
    private readonly spanRepository: MonitorSpanRepository,
    private readonly ductWafRepository: DuctWafRepository,
    private readonly loadRepository: MonitorLoadRepository,
    private readonly componentRepository: ComponentRepository,
    private readonly systemRepository: MonitorSystemRepository,
    private readonly systemComponentRepository: SystemComponentRepository,
    private readonly systemFuelFlowRepository: SystemFuelFlowRepository,
    private readonly qualificationRepository: MonitorQualificationRepository,
    private readonly leeQualificationRepository: LEEQualificationRepository,
    private readonly lmeQualificationRepository: LMEQualificationRepository,
    private readonly pctQualificationRepository: PCTQualificationRepository,
    private readonly unitCapacityRepository: UnitCapacityRepository,
    private readonly unitControlRepository: UnitControlRepository,
    private readonly unitFuelRepository: UnitFuelRepository,
    private readonly unitStackConfigRepository: UnitStackConfigurationRepository,
    private readonly reportingFreqRepository: MonitorPlanReportingFrequencyRepository,
    private readonly analyzerRangeRepository: AnalyzerRangeRepository,
    private readonly map: MonitorPlanMap,
    private readonly uscMap: UnitStackConfigurationMap,
    private readonly easeyContentService: EaseyContentService,
  ) {}

  async getMonSystemFuelFlow(
    monSysId: string,
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    const sysFuelFlows = await this.systemFuelFlowRepository.findBy({
      monitoringSystemRecordId: In(monSysIds),
    });
    return sysFuelFlows.filter(i => i.monitoringSystemRecordId === monSysId);
  }

  async getTopLevelMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(monPlanId);
    return this.map.one(mp);
  }

  async exportMonitorPlan(
    planId: string,
    rptValuesOnly: boolean = false,
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
        this.reportingFreqRepository.findBy({ monitorPlanId: planId }),
      );
    }

    if (getComments) {
      COMMENTS = getReportingFrquencies === true ? REPORTING_FREQ + 1 : 0;
      promises.push(this.commentRepository.findBy({ monitorPlanId: planId }));
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
        this.unitStackConfigRepository.getUnitStackConfigsByMonitorPlanId(
          planId,
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
        this.unitControlRepository.find({
          where: { unitId: In(unitIds) },
          order: { id: 'ASC' },
        }),
      );

      UNIT_FUEL = UNIT_CONTROLS + 1;
      promises.push(
        this.unitFuelRepository.find({
          where: { unitId: In(unitIds) },
          order: { id: 'ASC' },
        }),
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
        this.formulaRepository.find({
          where: { locationId: In(locationIds) },
          order: { id: 'ASC' },
        }),
      );

      DEFAULTS = FORMULAS + 1;
      promises.push(
        this.defaultRepository.find({ where: { locationId: In(locationIds) } }),
      );

      SPANS = DEFAULTS + 1;
      promises.push(
        this.spanRepository.find({
          where: { locationId: In(locationIds) },
          order: {
            id: 'ASC',
          },
        }),
      );

      DUCT_WAFS = SPANS + 1;
      promises.push(
        this.ductWafRepository.find({ where: { locationId: In(locationIds) } }),
      );

      LOADS = DUCT_WAFS + 1;
      promises.push(
        this.loadRepository.find({
          where: { locationId: In(locationIds) },
          order: { id: 'ASC' },
        }),
      );

      COMPONENTS = LOADS + 1;
      promises.push(
        new Promise((resolve, _reject) => {
          (async () => {
            const components = await this.componentRepository.find({
              where: { locationId: In(locationIds) },
              order: { id: 'ASC' },
            });
            if (components.length !== 0) {
              const componentIds = components.map(i => i.id);

              const analyzerRanges = this.analyzerRangeRepository.getAnalyzerRangesByCompIds(
                componentIds,
              );

              const rangeResults = await Promise.all([analyzerRanges]);

              components.forEach(c => {
                c.analyzerRanges = rangeResults[0].filter(
                  i => i.componentRecordId === c.id,
                );
              });
            }

            resolve(components);
          })();
        }),
      );

      SYSTEMS = COMPONENTS + 1;
      promises.push(
        new Promise((resolve, _reject) => {
          (async () => {
            const systems = await this.systemRepository.find({
              where: { locationId: In(locationIds) },
              order: { id: 'ASC' },
            });

            if (systems.length !== 0) {
              const systemIds = systems.map(i => i.id);
              const s1 = this.systemFuelFlowRepository.getFuelFlowsBySystemIds(
                systemIds,
              );
              const s2 = this.systemComponentRepository.getComponentsBySystemIds(
                systemIds,
              );

              const sysResults = await Promise.all([s1, s2]);

              systems.forEach(s => {
                s.fuelFlows = sysResults[0].filter(
                  i => i.monitoringSystemRecordId === s.id,
                );
                s.components = sysResults[1].filter(
                  i => i.monitoringSystemRecordId === s.id,
                );
              });
            }

            resolve(systems);
          })();
        }),
      );

      QUALIFICATIONS = SYSTEMS + 1;
      promises.push(
        new Promise((resolve, _reject) => {
          (async () => {
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

              quals.forEach(q => {
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
          })();
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

    const version = this.easeyContentService.monitorPlanSchema?.version;
    const mpDTO = { version, ...(await this.map.one(mp)) };
    if (getUnitStacks && results[UNIT_STACK_CONFIGS]) {
      const uscDTO = await this.uscMap.many(results[UNIT_STACK_CONFIGS]);
      mpDTO.unitStackConfigurationData = uscDTO;
    }

    if (rptValuesOnly) {
      await removeNonReportedValues(mpDTO);
    }

    return mpDTO;
  }
}
