import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CancelTransactionException,
  EaseyException,
} from '@us-epa-camd/easey-common/exceptions';
import { EntityManager, In } from 'typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { areSetsEqual, getEarliestDate } from '../utils';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CPMSQualificationWorkspaceRepository } from '../cpms-qualification-workspace/cpms-qualification-workspace.repository';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorPlanReportingFreqDTO } from '../dtos/monitor-plan-reporting-freq.dto';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { LEEQualificationWorkspaceRepository } from '../lee-qualification-workspace/lee-qualification.repository';
import { LMEQualificationWorkspaceRepository } from '../lme-qualification-workspace/lme-qualification.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MatsMethodWorkspaceRepository } from '../mats-method-workspace/mats-method.repository';
import { MonitorAttributeWorkspaceRepository } from '../monitor-attribute-workspace/monitor-attribute.repository';
import { EvalStatusCodeRepository } from '../monitor-configurations-workspace/eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from '../monitor-configurations-workspace/submission-availability-status.repository';
import { MonitorDefaultWorkspaceRepository } from '../monitor-default-workspace/monitor-default.repository';
import { MonitorFormulaWorkspaceRepository } from '../monitor-formula-workspace/monitor-formula.repository';
import { MonitorLoadWorkspaceRepository } from '../monitor-load-workspace/monitor-load.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method.repository';
import { MonitorPlanCommentWorkspaceRepository } from '../monitor-plan-comment-workspace/monitor-plan-comment.repository';
import { MonitorPlanCommentWorkspaceService } from '../monitor-plan-comment-workspace/monitor-plan-comment.service';
import { MonitorPlanLocationService } from '../monitor-plan-location-workspace/monitor-plan-location.service';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.repository';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorQualificationWorkspaceRepository } from '../monitor-qualification-workspace/monitor-qualification.repository';
import { MonitorSpanWorkspaceRepository } from '../monitor-span-workspace/monitor-span.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system.repository';
import { PCTQualificationWorkspaceRepository } from '../pct-qualification-workspace/pct-qualification.repository';
import { PlantService } from '../plant/plant.service';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { SystemComponentWorkspaceRepository } from '../system-component-workspace/system-component.repository';
import { SystemFuelFlowWorkspaceRepository } from '../system-fuel-flow-workspace/system-fuel-flow.repository';
import { UnitCapacityWorkspaceRepository } from '../unit-capacity-workspace/unit-capacity.repository';
import { UnitControlWorkspaceRepository } from '../unit-control-workspace/unit-control.repository';
import { UnitFuelWorkspaceRepository } from '../unit-fuel-workspace/unit-fuel.repository';
import { UnitProgramRepository } from '../unit-program/unit-program.repository';
import { UnitWorkspaceService } from '../unit-workspace/unit.service';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { removeNonReportedValues } from '../utilities/remove-non-reported-values';
import { withTransaction } from '../utils';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocation as MonitorLocationWorkspace } from '../entities/workspace/monitor-location.entity';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
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
    private readonly unitProgramRepository: UnitProgramRepository,
    private readonly unitWorkspaceService: UnitWorkspaceService,

    private readonly plantService: PlantService,
    private readonly uscMap: UnitStackConfigurationMap,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    @Inject(forwardRef(() => MonitorLocationWorkspaceService))
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly monitorPlanCommentService: MonitorPlanCommentWorkspaceService,
    private readonly monitorPlanLocationService: MonitorPlanLocationService,

    private map: MonitorPlanMap,
  ) {
    this.logger.setContext('MonitorPlanWorkspaceService');
  }

  private async calculateReportPeriodRangeFromLocations(
    monitorLocations: MonitorLocationDTO[],
    unitStackConfigs: UnitStackConfigurationDTO[],
    trx?: EntityManager,
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
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // Single location without unit stack configurations.
        const location = monitorLocations[0];

        if (!location?.unitId) {
          throw new EaseyException(
            new Error(
              'The location for a monitor plan with a single location must have a unit',
            ),
            HttpStatus.BAD_REQUEST,
          );
        }

        // Get the begin date from the earliest monitoring method associated with the unit.
        if (location.monitoringMethodData.length === 0) {
          this.logger.debug(
            `There is no method associated with the unit ${location.unitId}`,
          );
          beginDate = new Date();
        } else {
          const beginDateEpoch = Math.min(
            ...location.monitoringMethodData.map(m =>
              new Date(m.beginDate).getTime(),
            ),
          );
          beginDate = new Date(beginDateEpoch);
        }

        // Get the end date from the day before the earliest retire date of the unit.
        const locationRecord = await withTransaction(
          this.locationRepository,
          trx,
        ).findOneBy({
          id: location.id,
        });
        const unitRetireDateEpoch = Math.min(
          ...locationRecord.unit.opStatuses
            .filter(s => s.opStatusCode === 'RET')
            .map(s => new Date(s.beginDate).getTime()),
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
          const maxDate = new Date(max);
          const curDate = new Date(cur);
          return maxDate > curDate ? max : cur;
        }, null);
      endDate = unitStackConfigs
        .map(u => u.endDate)
        .reduce((min, cur) => {
          if (!min) return cur;
          if (!cur) return min;
          const minDate = new Date(min);
          const curDate = new Date(cur);
          return minDate < curDate ? min : cur;
        }, null);
    }

    // Convert the begin and end dates to report periods IDs.
    const reportingPeriodRepository = withTransaction(
      this.reportingPeriodRepository,
      trx,
    );
    const beginReportPeriodId = (
      await reportingPeriodRepository.getByDate(beginDate)
    ).id;
    const endReportPeriodId =
      endDate && (await reportingPeriodRepository.getByDate(endDate)).id;

    return [beginReportPeriodId, endReportPeriodId];
  }

  async updatePlanPeriodOnMethodUpdate(
    method: MonitorMethodDTO,
    userId: string,
    trx?: EntityManager,
  ) {
    // Get the first single-unit moitor plan associated with the method.
    const firstPlanRecord = await withTransaction(this.repository, trx)
      .createQueryBuilder('mp')
      .innerJoin('mp.monitorPlanLocations', 'mpl')
      .innerJoin('mpl.monitorLocation', 'ml')
      .innerJoin('mp.beginReportingPeriod', 'brp')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('COUNT(*)')
          .from(MonitorLocationWorkspace, 'ml')
          .innerJoin('ml.methods', 'm')
          .where('m.id = :methodId', {
            methodId: method.id,
          })
          .getQuery();
        return `(${subQuery}) = 1`;
      })
      .andWhere('ml.unitId IS NOT NULL')
      .orderBy('brp.beginDate', 'ASC')
      .getOne();

    if (!firstPlanRecord) return;

    // Update the begin reporting period of the monitor plan if the method's begin date is earlier.
    const reportingPeriodRepository = withTransaction(
      this.reportingPeriodRepository,
      trx,
    );
    const [
      firstPlanReportingPeriod,
      methodBeginReportingPeriod,
    ] = await Promise.all([
      reportingPeriodRepository.getById(firstPlanRecord.beginReportPeriodId),
      reportingPeriodRepository.getByDate(method.beginDate),
    ]);
    if (
      methodBeginReportingPeriod.year < firstPlanReportingPeriod.year ||
      (methodBeginReportingPeriod.year === firstPlanReportingPeriod.year &&
        methodBeginReportingPeriod.quarter < firstPlanReportingPeriod.quarter)
    ) {
      this.logger.debug('Updating the monitor plan begin reporting period', {
        monPlanId: firstPlanRecord.id,
        beginReportPeriod: methodBeginReportingPeriod.periodAbbreviation,
      });
      firstPlanRecord.beginReportPeriodId = methodBeginReportingPeriod.id;
      const repository = withTransaction(this.repository, trx);
      await repository.save(firstPlanRecord);
      await repository.resetToNeedsEvaluation(firstPlanRecord.id, userId);
    }
  }

  async createMonitorPlan({
    locations,
    facId,
    userId,
    beginReportPeriodId,
    endReportPeriodId,
    trx,
  }: {
    locations: MonitorLocationDTO[];
    facId: number;
    userId: string;
    beginReportPeriodId: number;
    endReportPeriodId: number;
    trx?: EntityManager;
  }) {
    // Create the `monitor_plan` record.
    const monitorPlanRecord = await withTransaction(
      this.repository,
      trx,
    ).createMonitorPlanRecord(
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
          trx,
        ),
      ),
    );

    // Create the reporting frequency record(s).
    const unitIds = locations
      .map(l => l.unitRecordId)
      .filter(id => id !== null);
    const unitPrograms = await withTransaction(
      this.unitProgramRepository,
      trx,
    ).getUnitProgramsByUnitIds(unitIds);

    // Get the program ranges and types from the unit programs.
    const reportingPeriodRepository = withTransaction(
      this.reportingPeriodRepository,
      trx,
    );
    const programRanges: ProgramRange[] = await Promise.all(
      unitPrograms
        .filter(up => up.unitMonitorCertBeginDate !== null)
        .map(async up => {
          const [begin, end] = await Promise.all([
            reportingPeriodRepository.getByDate(up.unitMonitorCertBeginDate),
            up.endDate && reportingPeriodRepository.getByDate(up.endDate),
          ]);
          return {
            type:
              up.program.code.ozoneSeasonIndicator === 1 ? 'ozone' : 'annual',
            begin: { year: begin.year, quarter: begin.quarter },
            end: end && { year: end.year, quarter: end.quarter },
          };
        }),
    );

    // Get the begin and end report periods for the reporting frequencies.
    const {
      year: beginYear,
      quarter: beginQuarter,
    } = await reportingPeriodRepository.getById(beginReportPeriodId);

    const { year: endYear, quarter: endQuarter } = endReportPeriodId
      ? await reportingPeriodRepository.getById(endReportPeriodId) // Use the monitor plan record's end report period ID if it exists
      : // Otherwise, calculate the end report period from the program ranges (used for calculating the reporting frequency's type, not end date)
        programRanges.reduce(
          (acc, cur) => ({
            year: Math.max(acc.year, cur.end?.year ?? 0, cur.begin?.year ?? 0),
            quarter: Math.max(
              acc.quarter,
              cur.end?.quarter ?? 0,
              cur.begin?.quarter ?? 0,
            ),
          }),
          {
            year: beginYear,
            quarter: beginQuarter,
          },
        );

    // Separate the program ranges by type.
    const { annualRanges, ozoneRanges } = programRanges.reduce(
      (acc, cur) => {
        if (cur.type === 'annual') {
          acc.annualRanges.push(cur);
        } else {
          acc.ozoneRanges.push(cur);
        }
        return acc;
      },
      { annualRanges: [] as ProgramRange[], ozoneRanges: [] as ProgramRange[] },
    );

    // Determine the monitoring plan reporting frequency type for each quarter.
    const periodFreqAssoc: ProgramPeriod[] = [];
    let curYear = beginYear;
    let curQuarter = beginQuarter;
    while (curYear <= endYear && curQuarter <= endQuarter) {
      if (
        annualRanges.some(
          r => r.begin.year <= curYear && curYear <= (r.end?.year ?? Infinity),
        )
      ) {
        // The period includes an annual program.
        periodFreqAssoc.push([curYear, curQuarter, 'annual']);
      } else if (
        ozoneRanges.some(
          r => r.begin.year <= curYear && curYear <= (r.end?.year ?? Infinity),
        )
      ) {
        // The period includes an ozone program and no annual program.
        periodFreqAssoc.push([curYear, curQuarter, 'ozone']);
      } else {
        // The period includes no program, default to annual.
        periodFreqAssoc.push([curYear, curQuarter, 'annual']);
      }

      if (curQuarter === 4) {
        curYear++;
        curQuarter = 1;
      } else {
        curQuarter++;
      }
    }

    // Calculate reporting frequency begin and end dates from the period types.
    function getFrequencyRanges(
      freqsByPeriod: ProgramPeriod[],
    ): Array<[ProgramPeriod, ProgramPeriod]> {
      if (freqsByPeriod.length === 0) return [];

      const cur = freqsByPeriod[0];
      const [_year, _quarter, freq] = cur;
      let nextRangeStart = freqsByPeriod.findIndex(p => p[2] !== freq);
      if (nextRangeStart === -1) nextRangeStart = freqsByPeriod.length;
      return [
        [freqsByPeriod[0], freqsByPeriod[nextRangeStart - 1]],
        ...getFrequencyRanges(freqsByPeriod.slice(nextRangeStart)),
      ];
    }
    const freqRanges = getFrequencyRanges(periodFreqAssoc);

    // Create the reporting frequency records.
    await Promise.all(
      freqRanges.map(async ([begin, end], i) => {
        const [beginYear, beginQuarter, beginFreq] = begin;
        const [endYear, endQuarter, endFreq] = end;
        if (beginFreq !== endFreq) {
          // Sanity check: the frequency must be consistent within a period.
          throw new EaseyException(
            new Error(
              'The reporting frequency must be consistent within a period',
            ),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const [beginReportPeriod, endReportPeriod] = await Promise.all([
          reportingPeriodRepository.getByYearQuarter(beginYear, beginQuarter),
          reportingPeriodRepository.getByYearQuarter(endYear, endQuarter),
        ]);
        await withTransaction(
          this.reportingFreqRepository,
          trx,
        ).createReportingFrequencyRecord({
          beginReportPeriodId: beginReportPeriod.id,
          endReportPeriodId:
            i === freqRanges.length - 1
              ? endReportPeriodId // Use the monitor plan record's end report period ID for the last frequency
              : endReportPeriod.id,
          monitorPlanId: monitorPlanRecord.id,
          reportFrequencyCode: beginFreq === 'annual' ? 'Q' : 'OS',
          userId,
        });
      }),
    );

    return await this.getMonitorPlan(monitorPlanRecord.id, {
      full: true,
      trx,
    });
  }

  private extractUnitAndStackPipeIds(
    plan: MonitorPlanDTO | UpdateMonitorPlanDTO,
  ) {
    return ([
      ...plan.unitStackConfigurationData,
      ...plan.monitoringLocationData,
    ] as PlanItem[]).reduce(
      (acc, cur) => {
        if (cur.unitId) acc.unitIds.add(cur.unitId);
        if (cur.stackPipeId) acc.stackPipeIds.add(cur.stackPipeId);
        return acc;
      },
      { unitIds: new Set<string>(), stackPipeIds: new Set<string>() },
    );
  }

  async getMonitorPlan(
    monPlanId: string,
    {
      full = false,
      trx,
    }: {
      full?: boolean;
      trx?: EntityManager;
    } = {},
  ): Promise<MonitorPlanDTO> {
    const mp = await withTransaction(this.repository, trx).getMonitorPlan(
      monPlanId,
      full,
    );
    const dto = await this.map.one(mp);

    dto.submissionAvailabilityCodeDescription = (
      await withTransaction(
        this.submissionsAvailabilityStatusCodeRepository,
        trx,
      ).findOneBy({
        subAvailabilityCode: mp.submissionAvailabilityCode,
      })
    ).subAvailabilityCodeDescription;

    dto.evalStatusCodeDescription = (
      await withTransaction(this.evalStatusCodeRepository, trx).findOneBy({
        evalStatusCd: mp.evalStatusCode,
      })
    ).evalStatusCodeDescription;

    dto.unitStackConfigurationData = await this.getMonitorPlanUnitStackConfigs(
      monPlanId,
      trx,
    );

    return dto;
  }

  async getMonitorPlanUnitStackConfigs(monPlanId: string, trx?: EntityManager) {
    const unitStackConfigs = await withTransaction(
      this.repository,
      trx,
    ).getMonitorPlanUnitStackConfigs(monPlanId);
    return await this.uscMap.many(unitStackConfigs);
  }

  async importMpPlan(
    targetPlanPayload: UpdateMonitorPlanDTO,
    userId: string,
    draft = false,
  ) {
    if (draft) {
      this.logger.debug('Formulating a draft monitor plan', targetPlanPayload);
    } else {
      this.logger.debug('Importing monitor plan', targetPlanPayload);
    }

    const facilityId = await this.plantService.getFacIdFromOris(
      targetPlanPayload.orisCode,
    );

    // Get a representation of the active plans.
    const activePlans = await this.matchToActivePlans(
      targetPlanPayload,
      facilityId,
    );
    this.logger.debug('Associated active plans', ...activePlans.map(p => p.id));

    let endedPlans: MonitorPlanDTO[] = [];
    let newPlan: MonitorPlanDTO = null;
    let unchangedPlans: MonitorPlanDTO[] = [];

    // Used for applying the payloads monitor plan comments.
    let targetPlan: MonitorPlanDTO = null;

    let shouldCreateNewPlan = false;

    try {
      // Start transaction.
      await this.entityManager.transaction(async trx => {
        /* MONITOR LOCATION MERGE LOGIC */
        this.logger.debug('Importing monitor locations');
        const planMonitoringLocationData = await this.monitorLocationService.importMonitorLocations(
          targetPlanPayload,
          facilityId,
          userId,
          trx,
        );

        /* UNIT STACK CONFIGURATION MERGE LOGIC */
        this.logger.debug('Importing unit stack configurations');
        const planUnitStackConfigurationData = await this.unitStackService.importUnitStacks(
          targetPlanPayload,
          facilityId,
          userId,
          trx,
        );

        /* MONITOR PLAN MERGE LOGIC */

        // Calculate the report period range from the update monitor plan.
        const [
          payloadBeginReportPeriodId,
          payloadEndReportPeriodId,
        ] = await this.calculateReportPeriodRangeFromLocations(
          planMonitoringLocationData,
          planUnitStackConfigurationData,
          trx,
        );

        let maxActivePlansEndReportPeriod = null;

        const reportingPeriodRepository = withTransaction(
          this.reportingPeriodRepository,
          trx,
        );

        // If there are no associated active plans, simply create a new plan.
        if (activePlans.length === 0) {
          // Match to an existing inactive plan in the database. If found, add the supplied plan to the unchanged plans. Otherwise, create a new plan.
          const matchedPlan = await this.matchToPlanByLocationsAndPeriod(
            targetPlanPayload,
            payloadBeginReportPeriodId,
            payloadEndReportPeriodId,
            trx,
          );
          if (matchedPlan) {
            targetPlan = matchedPlan;
            unchangedPlans.push(matchedPlan);
          } else {
            shouldCreateNewPlan = true;
          }
        } else {
          await Promise.all(
            activePlans.map(async activePlan => {
              // The active plan with the updates that have been applied so far in the transaction.
              const pendingActivePlan = await this.getMonitorPlan(
                activePlan.id,
                { full: true, trx },
              );
              this.logger.debug('pendingActivePlan', pendingActivePlan);
              // Compare the active plan locations against the imported plan locations.
              const locationsMatch = this.checkLocationsMatch(
                pendingActivePlan,
                targetPlanPayload,
              );

              if (locationsMatch) {
                if (
                  pendingActivePlan.endReportPeriodId !==
                  payloadEndReportPeriodId
                ) {
                  // If the locations match but the end report period differs, update the end report period of the active plan.
                  endedPlans.push(
                    await this.updateEndReportingPeriod(
                      pendingActivePlan,
                      payloadEndReportPeriodId,
                      userId,
                      trx,
                    ),
                  );
                  targetPlan = endedPlans[endedPlans.length - 1];
                } else {
                  // The active plan is unchanged.
                  unchangedPlans.push(pendingActivePlan),
                    (targetPlan = pendingActivePlan);
                }
              } else {
                // If the locations differ, create a new plan and update the end report period of the previously active plan.

                // Get the USC end periods associated with the active plan.
                const earliestUscEndDate = pendingActivePlan.unitStackConfigurationData
                  .map(usc => usc.endDate)
                  .reduce(getEarliestDate, null);

                // Get the unit end periods associated with the active plan.
                const monPlanUnits = await this.unitWorkspaceService.getUnitsByMonPlanId(
                  pendingActivePlan.id,
                  trx,
                );
                const earliestUnitEndDate = monPlanUnits
                  .map(u => u.endDate)
                  .reduce(getEarliestDate, null);

                // Calculate the max period from the USCs, or from the units if no USCs are associated with the active plan.
                const newActivePlanEndReportPeriod = await reportingPeriodRepository.getByDate(
                  earliestUscEndDate || earliestUnitEndDate,
                );

                // Update the maxEndReportPeriodId to the max period if greater.
                if (
                  new Date(newActivePlanEndReportPeriod.endDate) >
                  new Date(maxActivePlansEndReportPeriod?.endDate)
                ) {
                  maxActivePlansEndReportPeriod = newActivePlanEndReportPeriod;
                }

                shouldCreateNewPlan = true;
                endedPlans.push(
                  await this.updateEndReportingPeriod(
                    pendingActivePlan,
                    newActivePlanEndReportPeriod.id,
                    userId,
                    trx,
                  ),
                );
              }
            }),
          );
        }

        // Create a new monitor plan.
        if (shouldCreateNewPlan) {
          const newUnitStackConfigurationData = planUnitStackConfigurationData.filter(
            usc => usc.active,
          );
          const newMonitoringLocationData = planMonitoringLocationData.filter(
            l => {
              if (newUnitStackConfigurationData.length === 0) {
                return l.unitId && l.active;
              } else {
                return (
                  (newUnitStackConfigurationData.some(
                    ({ unitId }) => l.unitId === unitId,
                  ) ||
                    newUnitStackConfigurationData.some(
                      ({ stackPipeId }) => l.stackPipeId === stackPipeId,
                    )) &&
                  l.active
                );
              }
            },
          );
          const [
            newBeginReportPeriodId,
            newEndReportPeriodId,
          ] = await this.calculateReportPeriodRangeFromLocations(
            newMonitoringLocationData,
            newUnitStackConfigurationData,
            trx,
          );
          newPlan = await this.createMonitorPlan({
            locations: newMonitoringLocationData,
            facId: facilityId,
            userId,
            beginReportPeriodId: maxActivePlansEndReportPeriod
              ? await reportingPeriodRepository.getNextReportingPeriodId(
                  maxActivePlansEndReportPeriod.id,
                )
              : newBeginReportPeriodId,
            endReportPeriodId: newEndReportPeriodId,
            trx,
          });
          targetPlan = newPlan;
          this.logger.debug(
            'Imported locations differ from the active plan, created new plan',
            { mon_plan_id: newPlan.id },
          );
        }

        /* MONITOR PLAN COMMENT MERGE LOGIC */
        if (targetPlan) {
          await this.monitorPlanCommentService.importComments(
            targetPlanPayload.monitoringPlanCommentData,
            userId,
            targetPlan.id,
            trx,
          );
        }

        if (draft) {
          throw new CancelTransactionException();
        }
      });
    } catch (err) {
      if (!(err instanceof CancelTransactionException)) {
        throw err;
      }
    }

    const result = { endedPlans, newPlan, unchangedPlans };
    this.logger.debug('Monitor plan import result', result);
    return result;
  }

  private checkLocationsMatch(
    planA: MonitorPlanDTO | UpdateMonitorPlanDTO,
    planB: MonitorPlanDTO | UpdateMonitorPlanDTO,
  ) {
    return Object.values(
      [planA, planB].map(this.extractUnitAndStackPipeIds).reduce(
        (acc, cur) => ({
          unitIds: [...acc.unitIds, cur.unitIds],
          stackPipeIds: [...acc.stackPipeIds, cur.stackPipeIds],
        }),
        { unitIds: [], stackPipeIds: [] },
      ),
    ).every(pair => areSetsEqual(pair[0], pair[1]));
  }

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    return this.repository.revertToOfficialRecord(monPlanId);
  }

  private async matchToActivePlans(
    plan: UpdateMonitorPlanDTO,
    facilityId: number,
    { trx, full = false }: { trx?: EntityManager; full?: boolean } = {},
  ) {
    const databaseLocIds = (
      await this.monitorLocationService.getMonitorLocationsByFacilityAndOris(
        plan,
        facilityId,
        plan.orisCode,
        trx,
      )
    )
      .filter(l => l !== null)
      .map(l => l.id);

    if (databaseLocIds.length === 0) {
      throw new EaseyException(
        new Error(
          'No location records found for the supplied plan representation',
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    // Get all active plan records for the locations.
    const repository = withTransaction(this.repository, trx);
    const activePlanRecordIds = (
      await Promise.all(
        databaseLocIds.map(id => repository.getActivePlanByLocationId(id)),
      )
    )
      .filter(p => p !== null)
      .map(p => p.id)
      .filter((id, i, arr) => arr.indexOf(id) === i);

    return Promise.all(
      activePlanRecordIds.map(id =>
        this.getMonitorPlan(id, {
          full,
          trx,
        }),
      ),
    );
  }

  private async matchToPlanByLocationsAndPeriod(
    payload: MonitorPlanDTO | UpdateMonitorPlanDTO,
    beginReportPeriodId: number,
    endReportPeriodId: number,
    trx?: EntityManager,
  ) {
    const matchedPlan = await withTransaction(this.repository, trx)
      .createQueryBuilder('mp')
      .innerJoinAndSelect('mp.locations', 'l')
      .where('mp.beginReportPeriodId = :beginReportPeriodId', {
        beginReportPeriodId,
      })
      .andWhere('mp.endReportPeriodId = :endReportPeriodId', {
        endReportPeriodId,
      })
      .getOne();

    if (!matchedPlan) return null;

    const matchedPlanDto = await this.map.one(matchedPlan);
    return this.checkLocationsMatch(payload, matchedPlanDto)
      ? matchedPlanDto
      : null;
  }

  async updateDateAndUserId(monPlanId: string, userId: string): Promise<void> {
    return this.repository.updateDateAndUserId(monPlanId, userId);
  }

  async updateEndReportingPeriod(
    plan: MonitorPlanDTO,
    newEndReportPeriodId: number,
    userId: string,
    trx?: EntityManager,
  ) {
    this.logger.debug('Updating end report period of previously active plan', {
      mon_plan_id: plan.id,
      end_rpt_period_id: newEndReportPeriodId,
    });
    const repository = withTransaction(this.repository, trx);
    const reportingPeriodRepository = withTransaction(
      this.reportingPeriodRepository,
      trx,
    );
    const reportingFreqRepository = withTransaction(
      this.reportingFreqRepository,
      trx,
    );

    const planRecord = await repository.findOneBy({ id: plan.id });
    planRecord.endReportPeriodId = newEndReportPeriodId;
    await repository.save(planRecord);

    // Update the reporting frequency records of the previously active plan.
    const {
      year: updatedEndYear,
      quarter: updatedEndQuarter,
    } = await reportingPeriodRepository.getById(newEndReportPeriodId);

    let latestReportingFrequency: MonitorPlanReportingFreqDTO;
    let latestReportingFrequencyYear: number;
    let latestReportingFrequencyQuarter: number;

    for (const rf of plan.reportingFrequencies) {
      // Get the year and quarter of the begin period of the reporting frequency.
      const {
        year: rfBeginYear,
        quarter: rfBeginQuarter,
      } = await reportingPeriodRepository.getById(rf.beginReportPeriodId);

      // If the begin period of the reporting frequency is after the updated end period, delete the record.
      if (
        rfBeginYear > updatedEndYear ||
        (rfBeginYear === updatedEndYear && rfBeginQuarter > updatedEndQuarter)
      ) {
        await reportingFreqRepository.delete(rf.id);
      } else {
        // Compare the reporting frequencies and store the latest one for a later update.
        if (!latestReportingFrequency) {
          latestReportingFrequency = rf;
        } else {
          if (
            rfBeginYear > latestReportingFrequencyYear ||
            (rfBeginYear === latestReportingFrequencyYear &&
              rfBeginQuarter > latestReportingFrequencyQuarter)
          ) {
            latestReportingFrequency = rf;
            latestReportingFrequencyYear = rfBeginYear;
            latestReportingFrequencyQuarter = rfBeginQuarter;
          }
        }
      }
    }
    if (latestReportingFrequency) {
      // Update the end report period of the latest reporting frequency.
      const latestReportingFrequencyRecord = await reportingFreqRepository.findOneBy(
        { id: latestReportingFrequency.id },
      );
      latestReportingFrequencyRecord.endReportPeriodId = newEndReportPeriodId;
      await reportingFreqRepository.save(latestReportingFrequencyRecord);
    }

    await repository.resetToNeedsEvaluation(plan.id, userId);
    return await this.getMonitorPlan(plan.id, { full: true, trx });
  }

  async resetToNeedsEvaluation(
    locId: string,
    userId: string,
    trx?: EntityManager,
  ): Promise<void> {
    const repository = withTransaction(this.repository, trx);

    const plan = await repository.getActivePlanByLocationId(locId);

    const planId = plan.id;

    await repository.resetToNeedsEvaluation(planId, userId);
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

type PlanItem = {
  unitId: string;
  stackPipeId: string;
};
type ProgramPeriod = [number, number, string]; // [year, quarter, program type]
type ProgramRange = {
  type: 'annual' | 'ozone';
  begin: { year: number; quarter: number } | null;
  end: { year: number; quarter: number } | null;
};
