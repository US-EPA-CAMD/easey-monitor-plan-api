import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanCommentRepository } from '../monitor-plan-comment/monitor-plan-comment.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorAttributeRepository } from '../monitor-attribute/monitor-attribute.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MatsMethodRepository } from '../mats-method/mats-method.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorDefaultRepository } from '../monitor-default/monitor-default.repository';
import { MonitorSpanRepository } from '../monitor-span/monitor-span.repository';
import { DuctWafRepository } from '../duct-waf/duct-waf.repository';
import { MonitorLoadRepository } from '../monitor-load/monitor-load.repository';
import { ComponentRepository } from '../component/component.repository';
import { SystemComponentRepository } from '../system-component/system-component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { SystemFuelFlowRepository } from '../system-fuel-flow/system-fuel-flow.repository';
import { MonitorQualificationRepository } from '../monitor-qualification/monitor-qualification.repository';
import { LEEQualificationRepository } from '../lee-qualification/lee-qualification.repository';
import { LMEQualificationRepository } from '../lme-qualification/lme-qualification.repository';
import { PCTQualificationRepository } from '../pct-qualification/pct-qualification.repository';
import { UnitCapacityRepository } from '../unit-capacity/unit-capacity.repository';
import { UnitControlRepository } from '../unit-control/unit-control.repository';
import { UnitFuelRepository } from '../unit-fuel/unit-fuel.repository';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MonitorPlanReportingFrequencyRepository } from '../monitor-plan-reporting-freq/monitor-plan-reporting-freq.repository';
import { AnalyzerRangeRepository } from '../analyzer-range/analyzer-range.repository';
import { CPMSQualificationRepository } from '../cpms-qualification/cpms-qualification.repository';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private readonly repository: MonitorPlanRepository,
    @InjectRepository(MonitorPlanCommentRepository)
    private readonly commentRepository: MonitorPlanCommentRepository,
    @InjectRepository(MonitorLocationRepository)
    private readonly locationRepository: MonitorLocationRepository,
    @InjectRepository(MonitorAttributeRepository)
    private readonly attributeRepository: MonitorAttributeRepository,
    @InjectRepository(MonitorMethodRepository)
    private readonly methodRepository: MonitorMethodRepository,
    @InjectRepository(MatsMethodRepository)
    private readonly matsMethodRepository: MatsMethodRepository,
    @InjectRepository(MonitorFormulaRepository)
    private readonly formulaRepository: MonitorFormulaRepository,
    @InjectRepository(MonitorDefaultRepository)
    private readonly defaultRepository: MonitorDefaultRepository,
    @InjectRepository(MonitorSpanRepository)
    private readonly spanRepository: MonitorSpanRepository,
    @InjectRepository(DuctWafRepository)
    private readonly ductWafRepository: DuctWafRepository,
    @InjectRepository(MonitorLoadRepository)
    private readonly loadRepository: MonitorLoadRepository,
    @InjectRepository(ComponentRepository)
    private readonly componentRepository: ComponentRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly systemRepository: MonitorSystemRepository,
    @InjectRepository(SystemComponentRepository)
    private readonly systemComponentRepository: SystemComponentRepository,
    @InjectRepository(SystemFuelFlowRepository)
    private readonly systemFuelFlowRepository: SystemFuelFlowRepository,
    @InjectRepository(MonitorQualificationRepository)
    private readonly qualificationRepository: MonitorQualificationRepository,
    @InjectRepository(LEEQualificationRepository)
    private readonly leeQualificationRepository: LEEQualificationRepository,
    @InjectRepository(LMEQualificationRepository)
    private readonly lmeQualificationRepository: LMEQualificationRepository,
    @InjectRepository(PCTQualificationRepository)
    private readonly pctQualificationRepository: PCTQualificationRepository,
    @InjectRepository(UnitCapacityRepository)
    private readonly unitCapacityRepository: UnitCapacityRepository,
    @InjectRepository(UnitControlRepository)
    private readonly unitControlRepository: UnitControlRepository,
    @InjectRepository(UnitFuelRepository)
    private readonly unitFuelRepository: UnitFuelRepository,
    @InjectRepository(UnitStackConfigurationRepository)
    private readonly unitStackConfigRepository: UnitStackConfigurationRepository,
    @InjectRepository(MonitorPlanReportingFrequencyRepository)
    private readonly reportingFreqRepository: MonitorPlanReportingFrequencyRepository,
    @InjectRepository(AnalyzerRangeRepository)
    private readonly analyzerRangeRepository: AnalyzerRangeRepository,
    @InjectRepository(CPMSQualificationRepository)
    private readonly cpmsQualRepository: CPMSQualificationRepository,
    private readonly map: MonitorPlanMap,
    private readonly uscMap: UnitStackConfigurationMap,
  ) {}

  async getMonSystemFuelFlow(
    monSysId: string,
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    const sysFuelFlows = await this.systemFuelFlowRepository.find({
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
        new Promise(async (resolve, reject) => {
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
            const q4 = this.cpmsQualRepository.find({
              where: { qualificationId: In(qualIds) },
            });

            const qualResults = await Promise.all([q1, q2, q3, q4]);

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
              q.cpmsQualifications = qualResults[3].filter(
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
