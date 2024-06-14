import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { MonitorPlanLocationService } from '../monitor-plan-location-workspace/monitor-plan-location.service';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CPMSQualificationWorkspaceRepository } from '../cpms-qualification-workspace/cpms-qualification-workspace.repository';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from '../monitor-configurations-workspace/submission-availability-status.repository';
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
import { removeNonReportedValues } from '../utilities/remove-non-reported-values';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    private readonly repository: MonitorPlanWorkspaceRepository,
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    private readonly submissionsAvailabilityStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
    private readonly locationRepository: MonitorLocationWorkspaceRepository,
    private readonly commentRepository: MonitorPlanCommentWorkspaceRepository,
    private readonly attributeRepository: MonitorAttributeWorkspaceRepository,
    private readonly methodRepository: MonitorMethodWorkspaceRepository,
    private readonly matsMethodRepository: MatsMethodWorkspaceRepository,
    private readonly formulaRepository: MonitorFormulaWorkspaceRepository,
    private readonly defaultRepository: MonitorDefaultWorkspaceRepository,
    private readonly spanRepository: MonitorSpanWorkspaceRepository,
    private readonly ductWafRepository: DuctWafWorkspaceRepository,
    private readonly loadRepository: MonitorLoadWorkspaceRepository,
    private readonly componentRepository: ComponentWorkspaceRepository,
    private readonly systemRepository: MonitorSystemWorkspaceRepository,
    private readonly unitCapacityRepository: UnitCapacityWorkspaceRepository,
    private readonly unitControlRepository: UnitControlWorkspaceRepository,
    private readonly unitFuelRepository: UnitFuelWorkspaceRepository,
    private readonly qualificationRepository: MonitorQualificationWorkspaceRepository,
    private readonly systemFuelFlowRepository: SystemFuelFlowWorkspaceRepository,
    private readonly systemComponentRepository: SystemComponentWorkspaceRepository,
    private readonly analyzerRangeRepository: AnalyzerRangeWorkspaceRepository,
    private readonly leeQualificationRepository: LEEQualificationWorkspaceRepository,
    private readonly lmeQualificationRepository: LMEQualificationWorkspaceRepository,
    private readonly pctQualificationRepository: PCTQualificationWorkspaceRepository,
    private readonly unitStackConfigRepository: UnitStackConfigurationWorkspaceRepository,
    private readonly reportingFreqRepository: MonitorPlanReportingFrequencyWorkspaceRepository,
    private readonly cpmsQualRepository: CPMSQualificationWorkspaceRepository,
    private readonly reportingPeriodRepository: ReportingPeriodRepository,

    private readonly plantService: PlantService,
    private readonly uscMap: UnitStackConfigurationMap,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    @Inject(forwardRef(() => MonitorLocationWorkspaceService))
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly monitorPlanCommentService: MonitorPlanCommentWorkspaceService,
    private readonly monitorPlanLocationService: MonitorPlanLocationService,

    private map: MonitorPlanMap,
  ) {}

  private async calcluateReportPeriodRange(
    monitorLocations: MonitorLocationDTO[],
    unitStackConfigs: UnitStackConfigurationDTO[],
  ) {
    let beginDate: Date;
    let endDate: Date;

    if (unitStackConfigs.length === 0) {
      if (monitorLocations.length === 0) {
        throw new EaseyException(
          new Error('A monitor plan must have at least one location'),
          HttpStatus.BAD_REQUEST,
        );
      } else if (monitorLocations.length > 1) {
        throw new EaseyException(
          new Error(
            'Cannot have multiple locations without unit stack configurations',
          ),
          HttpStatus.INTERNAL_SERVER_ERROR, // This is an internal error because the data should have been validated before this point.
        );
      } else {
        // Single location without unit stack configurations.
        const location = monitorLocations[0];

        if (!location.unitId) {
          throw new EaseyException(
            new Error(
              'The location for a monitor plan with a single location must have a unit',
            ),
            HttpStatus.BAD_REQUEST,
          );
        }

        // Get the begin date from the earliest monitoring method associated with the unit.
        const beginDateEpoch = Math.min(
          ...location.monitoringMethodData.map(m => m.beginDate.getTime()),
        );
        if (!beginDateEpoch) {
          throw new EaseyException(
            new Error(
              `There is no method associated with the unit ${location.unitId}`,
            ),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        beginDate = new Date(beginDateEpoch);

        // Get the end date from the day before the earliest retire date of the unit.
        const locationRecord = await this.locationRepository.findOneBy({
          id: location.id,
        });
        const unitRetireDateEpoch = Math.min(
          ...locationRecord.unit.opStatuses
            .filter(s => s.opStatusCode === 'RET')
            .map(s => s.beginDate.getTime()),
        );
        endDate = Number.isFinite(unitRetireDateEpoch)
          ? new Date(unitRetireDateEpoch - 24 * 60 * 60 * 1000) // Retire date in epoch milliseconds minus 1 day.
          : null;
      }
    } else {
      // Get the begin and end dates from the unit stack configurations.
      beginDate = unitStackConfigs
        .map(u => u.beginDate)
        .reduce((max, cur) => {
          if (!max) return cur;
          if (!cur) return max;
          return cur.getTime() > max.getTime() ? max : cur;
        }, null);
      endDate = unitStackConfigs
        .map(u => u.endDate)
        .reduce((min, cur) => {
          if (!min) return cur;
          if (!cur) return min;
          return cur.getTime() < min.getTime() ? min : cur;
        }, null);
    }

    // Convert the begin and end dates to report periods IDs.
    const beginReportPeriodId = await this.reportingPeriodRepository.getIdFromDate(
      beginDate,
    );
    const endReportPeriodId = await this.reportingPeriodRepository.getIdFromDate(
      endDate,
    );

    return [beginReportPeriodId, endReportPeriodId];
  }

  async createMonitorPlan(
    locations: MonitorLocationDTO[],
    facId: number,
    userId: string,
    beginReportPeriodId: number,
    endReportPeriodId: number,
  ) {
    // Create the `monitor_plan` record.
    const monitorPlanRecord = await this.repository.createMonitorPlanRecord(
      facId,
      userId,
      beginReportPeriodId,
      endReportPeriodId,
    );

    // Create the `monitor_plan_location` record(s).
    await Promise.all(
      locations.map(l =>
        this.monitorPlanLocationService.createMonPlanLocationRecord(
          monitorPlanRecord.id,
          l.id,
        ),
      ),
    );

    // TODO: Create the reporting frequency record(s).

    return this.map.one(monitorPlanRecord);
  }

  async importMpPlan(
    plan: UpdateMonitorPlanDTO,
    userId: string,
  ): Promise<MonitorPlanDTO> {
    const facilityId = await this.plantService.getFacIdFromOris(plan.orisCode);

    const databaseLocId = (
      await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
        plan,
        facilityId,
        plan.orisCode,
      )
    )
      .filter(l => l !== null)
      .pop()?.id;

    // TODO: Start transaction.

    /* MONITOR LOCATION MERGE LOGIC */
    const planMonitoringLocationData = await this.monitorLocationService.importMonitorLocations(
      plan,
      facilityId,
      userId,
    );

    /* UNIT STACK CONFIGURATION MERGE LOGIC */
    const planUnitStackConfigurationData = await this.unitStackService.importUnitStacks(
      plan,
      facilityId,
      userId,
    );

    /* MONITOR PLAN MERGE LOGIC */

    const [
      beginReportPeriodId,
      endReportPeriodId,
    ] = await this.calcluateReportPeriodRange(
      planMonitoringLocationData,
      planUnitStackConfigurationData,
    );

    // Get the active plan.
    const activePlanRecord = databaseLocId
      ? await this.repository.getActivePlanByLocationId(databaseLocId)
      : null;

    if (!activePlanRecord) {
      throw new EaseyException(
        new Error('No active plan found for the location'),
        HttpStatus.NOT_FOUND,
      );
    }

    // Get a representation of the active plan.
    let activePlan = await this.getMonitorPlan(activePlanRecord.id);

    // Compare the active plan against the imported plan.
    const activePlanLocationIds = activePlan.monitoringLocationData.map(
      l => l.unitId ?? l.stackPipeId,
    );
    const workingPlanLocationIds = planMonitoringLocationData.map(
      l => l.unitId ?? l.stackPipeId,
    );
    const locationsChanged =
      activePlanLocationIds.some(id => !workingPlanLocationIds.includes(id)) ||
      workingPlanLocationIds.some(id => !activePlanLocationIds.includes(id));
    const reportingPeriodsChanged =
      beginReportPeriodId !== activePlan.beginReportPeriodId ||
      endReportPeriodId !== activePlan.endReportPeriodId;

    if (locationsChanged) {
      // Create a new plan.
      const newPlan = await this.createMonitorPlan(
        planMonitoringLocationData,
        facilityId,
        userId,
        beginReportPeriodId,
        endReportPeriodId,
      );

      // TODO: Update the end report period and reporting frequency of the active plan.

      this.repository.resetToNeedsEvaluation(activePlan.id, userId);

      // Set the new plan as the active plan.
      activePlan = newPlan;
    } else if (reportingPeriodsChanged) {
      if (beginReportPeriodId !== activePlan.beginReportPeriodId) {
        throw new EaseyException(
          new Error(
            'The begin report period of the active plan does not match the begin report period of the imported plan',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (endReportPeriodId !== activePlan.endReportPeriodId) {
        if (activePlan.endReportPeriodId) {
          // If the active plan has an end report period, it must match the imported plan.
          throw new EaseyException(
            new Error(
              'The end report period of the active plan does not match the end report period of the imported plan',
            ),
            HttpStatus.BAD_REQUEST,
          );
        }

        // TODO: Update the end report period and reporting frequency of the active plan.

        this.repository.resetToNeedsEvaluation(activePlan.id, userId);
      }
    }

    /* MONITOR PLAN COMMENT MERGE LOGIC */
    await this.monitorPlanCommentService.importComments(
      plan,
      userId,
      activePlan.id,
    );

    // TODO: Commit transaction.

    return null;
  }

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    return this.repository.revertToOfficialRecord(monPlanId);
  }

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(monPlanId);
    const dto = await this.map.one(mp);

    dto.submissionAvailabilityCodeDescription = (
      await this.submissionsAvailabilityStatusCodeRepository.findOneBy({
        subAvailabilityCode: mp.submissionAvailabilityCode,
      })
    ).subAvailabilityCodeDescription;

    dto.evalStatusCodeDescription = (
      await this.evalStatusCodeRepository.findOneBy({
        evalStatusCd: mp.evalStatusCode,
      })
    ).evalStatusCodeDescription;

    return dto;
  }

  async updateDateAndUserId(monPlanId: string, userId: string): Promise<void> {
    return this.repository.updateDateAndUserId(monPlanId, userId);
  }

  async resetToNeedsEvaluation(locId: string, userId: string): Promise<void> {
    const plan = await this.repository.getActivePlanByLocationId(locId);

    const planId = plan.id;

    await this.repository.resetToNeedsEvaluation(planId, userId);
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
              const s2 = this.systemComponentRepository.getSystemComponentsBySystemIds(
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
              const q4 = this.cpmsQualRepository.find({
                where: { qualificationId: In(qualIds) },
              });

              const qualResults = await Promise.all([q1, q2, q3, q4]);

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
                q.cpmsQualifications = qualResults[3].filter(
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

    let mpDTO = await this.map.one(mp);

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
