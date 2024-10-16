import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';
import { MonitorPlan as MonitorPlanWorkspace } from '../entities/workspace/monitor-plan.entity';
import { UpdateMonitorPlanDTO } from '../dtos/monitor-plan-update.dto';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { UnitDTO } from '../dtos/unit.dto';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { MonitorLocation as MonitorLocationWorkspace } from '../entities/workspace/monitor-location.entity';
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
import { EaseyContentService } from '../monitor-plan-easey-content/easey-content.service';
import { MonitorPlanLocationService } from '../monitor-plan-location-workspace/monitor-plan-location.service';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.repository';
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
import { UnitProgramWorkspaceRepository } from '../unit-program-workspace/unit-program.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { UnitWorkspaceService } from '../unit-workspace/unit.service';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';
import { removeNonReportedValues } from '../utilities/remove-non-reported-values';
import { throwIfErrors, withTransaction } from '../utils';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

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
    private readonly reportingPeriodRepository: ReportingPeriodRepository,
    private readonly unitProgramRepository: UnitProgramWorkspaceRepository,
    private readonly unitWorkspaceService: UnitWorkspaceService,
    private readonly easeyContentService: EaseyContentService,
    private readonly plantService: PlantService,
    private readonly uscMap: UnitStackConfigurationMap,
    private readonly unitStackService: UnitStackConfigurationWorkspaceService,
    @Inject(forwardRef(() => MonitorLocationWorkspaceService))
    private readonly monitorLocationService: MonitorLocationWorkspaceService,
    private readonly monitorPlanCommentService: MonitorPlanCommentWorkspaceService,
    private readonly monitorPlanLocationService: MonitorPlanLocationService,
    private readonly userCheckOutService: UserCheckOutService,

    private map: MonitorPlanMap,
  ) {
    this.logger.setContext('MonitorPlanWorkspaceService');
  }

  private workingPlanLocationsMatch(
    a: Array<UnitDTO | UnitStackConfigurationDTO>,
    b: Array<UnitDTO | UnitStackConfigurationDTO>,
  ) {
    const {
      unitIds: unitIdsA,
      stackPipeIds: stackPipeIdsA,
    } = this.getItemLocationIds(a);
    const {
      unitIds: unitIdsB,
      stackPipeIds: stackPipeIdsB,
    } = this.getItemLocationIds(b);

    return (
      unitIdsA.size === unitIdsB.size &&
      [...unitIdsA].every(id => unitIdsB.has(id)) &&
      stackPipeIdsA.size === stackPipeIdsB.size &&
      [...stackPipeIdsA].every(id => stackPipeIdsB.has(id))
    );
  }

  private checkLocationsIntersect(
    a: WorkingConfiguration,
    b: WorkingConfiguration,
  ) {
    const {
      unitIds: unitIdsA,
      stackPipeIds: stackPipeIdsA,
    } = this.getItemLocationIds(a.items);
    const {
      unitIds: unitIdsB,
      stackPipeIds: stackPipeIdsB,
    } = this.getItemLocationIds(b.items);

    for (const unitId of unitIdsA) {
      if (unitIdsB.has(unitId)) return true;
    }

    for (const stackPipeId of stackPipeIdsA) {
      if (stackPipeIdsB.has(stackPipeId)) return true;
    }

    return false;
  }

  private checkPeriodsIntersect(
    a: WorkingConfiguration,
    b: WorkingConfiguration,
  ) {
    if (a.beginYear > b.endYear || a.endYear < b.beginYear) return false;
    if (a.beginYear === b.endYear && a.beginQuarter > b.endQuarter)
      return false;
    if (a.endYear === b.beginYear && a.endQuarter < b.beginQuarter)
      return false;
    return true;
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
    const [
      firstPlanReportingPeriod,
      methodBeginReportingPeriod,
    ] = await Promise.all([
      this.reportingPeriodRepository.getById(
        firstPlanRecord.beginReportPeriodId,
      ),
      this.reportingPeriodRepository.getByDate(method.beginDate),
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
      firstPlanRecord.updateDate = currentDateTime();
      const repository = withTransaction(this.repository, trx);
      await repository.save(firstPlanRecord);
      await repository.resetToNeedsEvaluation(firstPlanRecord.id, userId);
    }
  }

  private compareReportPeriodDescriptions(a: string, b: string) {
    const getYearAndQuarterFromDescription = (desc: string) => {
      const [year, quarter] = desc
        .split(' ')
        .map((s, i) => (i === 1 ? s.split('Q').pop() : s))
        .map(Number);
      return { year, quarter };
    };
    const { year: yearA, quarter: quarterA } = getYearAndQuarterFromDescription(
      a,
    );
    const { year: yearB, quarter: quarterB } = getYearAndQuarterFromDescription(
      b,
    );
    if (yearA > yearB) return 1;
    if (yearA < yearB) return -1;
    if (quarterA > quarterB) return 1;
    if (quarterA < quarterB) return -1;
    return 0;
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
    const unitRecordIds = locations
      .map(l => l.unitRecordId)
      .filter(id => id !== null);
    const unitPrograms = await withTransaction(
      this.unitProgramRepository,
      trx,
    ).getUnitProgramsByUnitRecordIds(unitRecordIds);

    // Get the program ranges and types from the unit programs.
    const programRanges: ProgramRange[] = await Promise.all(
      unitPrograms
        .filter(up => up.unitMonitorCertBeginDate !== null)
        .map(async up => {
          const [begin, end] = await Promise.all([
            this.reportingPeriodRepository.getByDate(
              up.unitMonitorCertBeginDate,
            ),
            up.endDate && this.reportingPeriodRepository.getByDate(up.endDate),
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
    } = await this.reportingPeriodRepository.getById(beginReportPeriodId);

    const { year: endYear, quarter: endQuarter } = endReportPeriodId
      ? await this.reportingPeriodRepository.getById(endReportPeriodId) // Use the monitor plan record's end report period ID if it exists
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
    while (
      curYear < endYear ||
      (curYear === endYear && curQuarter <= endQuarter)
    ) {
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
          this.reportingPeriodRepository.getByYearQuarter(
            beginYear,
            beginQuarter,
          ),
          this.reportingPeriodRepository.getByYearQuarter(endYear, endQuarter),
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

  async createNewSingleUnitMonitorPlan(
    unitId: string,
    orisCode: number,
    userId: string,
    draft = false,
  ) {
    if (draft) {
      this.logger.log(`Formulating a draft monitor plan for unit ${unitId}`);
    } else {
      this.logger.log(`Creating a new monitor plan for unit ${unitId}`);
    }

    // Check if the unit is already associated with a monitor plan.
    const associatedPlans = await this.repository
      .createQueryBuilder('mp')
      .select('mp.id', 'id')
      .innerJoin('mp.locations', 'l')
      .innerJoin('l.unit', 'u')
      .innerJoin('u.plant', 'p')
      .where('u.name = :unitId', { unitId })
      .andWhere('p.orisCode = :orisCode', { orisCode })
      .getRawMany();
    if (associatedPlans.length > 0) {
      this.logger.debug(
        `Plans associated with unit ${unitId}:`,
        associatedPlans.map(p => p.id),
      );
      throw new EaseyException(
        new Error(
          `Unit ${unitId} already associated with ${associatedPlans.length} monitor plans`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const facilityId = await this.plantService.getFacIdFromOris(orisCode);
    const location = await this.monitorLocationService.getOrCreateUnitLocation({
      create: true,
      facilityId,
      orisCode,
      unitId,
      userId,
    });
    const beginReportPeriodId = (
      await this.reportingPeriodRepository.getByDate(new Date())
    ).id;

    // Start a transaction.
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    let result: MonitorPlanDTO;
    try {
      const trx = queryRunner.manager;

      result = await this.createMonitorPlan({
        locations: [location],
        facId: facilityId,
        userId,
        beginReportPeriodId,
        endReportPeriodId: null,
        trx,
      });

      if (draft) {
        // Rollback the transaction if the operation is a draft.
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    this.logger.debug(`Created a new monitor plan with ID ${result.id}`);

    return result;
  }

  private getItemLocationIds(
    items: Array<UnitDTO | UnitStackConfigurationDTO>,
  ) {
    const unitIds = new Set(
      items
        .map(item => item.unitId)
        .filter(item => item !== null && item !== undefined),
    );
    const stackPipeIds = new Set(
      items
        .map(item => {
          if (this.isUnitDTO(item)) {
            return null;
          } else {
            return item.stackPipeId;
          }
        })
        .filter(item => item !== null && item !== undefined),
    );

    return { unitIds, stackPipeIds };
  }

  private getMergedConfiguration(
    a: WorkingConfiguration,
    b: WorkingConfiguration,
  ) {
    const combinedItems = [...a.items, ...b.items];

    if (a.beginYear === b.beginYear && a.beginQuarter === b.beginQuarter) {
      if (a.endYear === b.endYear && a.endQuarter === b.endQuarter) {
        return {
          id: uuid(),
          items: combinedItems,
          beginYear: a.beginYear,
          beginQuarter: a.beginQuarter,
          endYear: a.endYear,
          endQuarter: a.endQuarter,
        };
      }

      if (
        a.endYear < b.endYear ||
        (a.endYear === b.endYear && a.endQuarter < b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: a.beginYear,
            beginQuarter: a.beginQuarter,
            endYear: b.endYear,
            endQuarter: b.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: combinedItems,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
            {
              id: uuid(),
              items: b.items,
              beginYear: a.endQuarter === 4 ? a.endYear + 1 : a.endYear,
              beginQuarter: a.endQuarter === 4 ? 1 : a.endQuarter + 1,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        }
      }

      if (
        a.endYear > b.endYear ||
        (a.endYear === b.endYear && a.endQuarter > b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: a.beginYear,
            beginQuarter: a.beginQuarter,
            endYear: a.endYear,
            endQuarter: a.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: combinedItems,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
            {
              id: uuid(),
              items: a.items,
              beginYear: b.endQuarter === 4 ? b.endYear + 1 : b.endYear,
              beginQuarter: b.endQuarter === 4 ? 1 : b.endQuarter + 1,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        }
      }
    }

    if (
      a.beginYear < b.beginYear ||
      (a.beginYear === b.beginYear && a.beginQuarter < b.beginQuarter)
    ) {
      if (a.endYear === b.endYear && a.endQuarter === b.endQuarter) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: a.beginYear,
            beginQuarter: a.beginQuarter,
            endYear: a.endYear,
            endQuarter: a.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: a.items,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: b.beginQuarter === 1 ? b.beginYear - 1 : b.beginYear,
              endQuarter: b.beginQuarter === 1 ? 4 : b.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        }
      }

      if (
        a.endYear < b.endYear ||
        (a.endYear === b.endYear && a.endQuarter < b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: a.beginYear,
            beginQuarter: a.beginQuarter,
            endYear: b.endYear,
            endQuarter: b.endQuarter,
          };
        } else if (this.workingPlanLocationsMatch(a.items, combinedItems)) {
          return [
            {
              id: uuid(),
              items: a.items,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
            {
              id: uuid(),
              items: b.items,
              beginYear: a.endQuarter === 4 ? a.endYear + 1 : a.endYear,
              beginQuarter: a.endQuarter === 4 ? 1 : a.endQuarter + 1,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        } else if (this.workingPlanLocationsMatch(b.items, combinedItems)) {
          return [
            {
              id: uuid(),
              items: a.items,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: b.beginQuarter === 1 ? b.beginYear - 1 : b.beginYear,
              endQuarter: b.beginQuarter === 1 ? 4 : b.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: b.items,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        } else {
          return [
            {
              id: uuid(),
              items: a.items,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: b.beginQuarter === 1 ? b.beginYear - 1 : b.beginYear,
              endQuarter: b.beginQuarter === 1 ? 4 : b.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
            {
              id: uuid(),
              items: b.items,
              beginYear: a.endQuarter === 4 ? a.endYear + 1 : a.endYear,
              beginQuarter: a.endQuarter === 4 ? 1 : a.endQuarter + 1,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        }
      }

      if (
        a.endYear > b.endYear ||
        (a.endYear === b.endYear && a.endQuarter > b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(a.items, combinedItems)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: a.beginYear,
            beginQuarter: a.beginQuarter,
            endYear: a.endYear,
            endQuarter: a.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: a.items,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: b.beginQuarter === 1 ? b.beginYear - 1 : b.beginYear,
              endQuarter: b.beginQuarter === 1 ? 4 : b.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
            {
              id: uuid(),
              items: a.items,
              beginYear: b.endQuarter === 4 ? b.endYear + 1 : b.endYear,
              beginQuarter: b.endQuarter === 4 ? 1 : b.endQuarter + 1,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        }
      }
    }

    if (
      a.beginYear > b.beginYear ||
      (a.beginYear === b.beginYear && a.beginQuarter > b.beginQuarter)
    ) {
      if (a.endYear === b.endYear && a.endQuarter === b.endQuarter) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: b.beginYear,
            beginQuarter: b.beginQuarter,
            endYear: b.endYear,
            endQuarter: b.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: b.items,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: a.beginQuarter === 1 ? a.beginYear - 1 : a.beginYear,
              endQuarter: a.beginQuarter === 1 ? 4 : a.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        }
      }

      if (
        a.endYear < b.endYear ||
        (a.endYear === b.endYear && a.endQuarter < b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(b.items, combinedItems)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: b.beginYear,
            beginQuarter: b.beginQuarter,
            endYear: b.endYear,
            endQuarter: b.endQuarter,
          };
        } else {
          return [
            {
              id: uuid(),
              items: b.items,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: a.beginQuarter === 1 ? a.beginYear - 1 : a.beginYear,
              endQuarter: a.beginQuarter === 1 ? 4 : a.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
            {
              id: uuid(),
              items: b.items,
              beginYear: a.endQuarter === 4 ? a.endYear + 1 : a.endYear,
              beginQuarter: a.endQuarter === 4 ? 1 : a.endQuarter + 1,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
          ];
        }
      }

      if (
        a.endYear > b.endYear ||
        (a.endYear === b.endYear && a.endQuarter > b.endQuarter)
      ) {
        if (this.workingPlanLocationsMatch(a.items, b.items)) {
          return {
            id: uuid(),
            items: combinedItems,
            beginYear: b.beginYear,
            beginQuarter: b.beginQuarter,
            endYear: a.endYear,
            endQuarter: a.endQuarter,
          };
        } else if (this.workingPlanLocationsMatch(b.items, combinedItems)) {
          return [
            {
              id: uuid(),
              items: combinedItems,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
            {
              id: uuid(),
              items: a.items,
              beginYear: b.endQuarter === 4 ? b.endYear + 1 : b.endYear,
              beginQuarter: b.endQuarter === 4 ? 1 : b.endQuarter + 1,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        } else if (this.workingPlanLocationsMatch(a.items, combinedItems)) {
          return [
            {
              id: uuid(),
              items: b.items,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: a.beginQuarter === 1 ? a.beginYear - 1 : a.beginYear,
              endQuarter: a.beginQuarter === 1 ? 4 : a.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        } else {
          return [
            {
              id: uuid(),
              items: b.items,
              beginYear: b.beginYear,
              beginQuarter: b.beginQuarter,
              endYear: a.beginQuarter === 1 ? a.beginYear - 1 : a.beginYear,
              endQuarter: a.beginQuarter === 1 ? 4 : a.beginQuarter - 1,
            },
            {
              id: uuid(),
              items: combinedItems,
              beginYear: a.beginYear,
              beginQuarter: a.beginQuarter,
              endYear: b.endYear,
              endQuarter: b.endQuarter,
            },
            {
              id: uuid(),
              items: a.items,
              beginYear: b.endQuarter === 4 ? b.endYear + 1 : b.endYear,
              beginQuarter: b.endQuarter === 4 ? 1 : b.endQuarter + 1,
              endYear: a.endYear,
              endQuarter: a.endQuarter,
            },
          ];
        }
      }
    }
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
    if (!mp) return null;

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

    dto.unitStackConfigurationData = await this.unitStackService.getUnitStackConfigsByMonitorPlanId(
      monPlanId,
      trx,
    );

    return dto;
  }

  private getYearAndQuarterFromDate(dateOrDatestring: Date) {
    if (!dateOrDatestring) return [Infinity, Infinity];

    const date = new Date(dateOrDatestring);
    return [date.getUTCFullYear(), Math.floor(date.getUTCMonth() / 3) + 1];
  }

  private mapItemsToWorkingPlans(
    items: Array<UnitDTO | UnitStackConfigurationDTO>,
  ): WorkingConfiguration[] {
    return items
      .map(item => {
        if (!item.beginDate) return null; // Skip items without a begin date (e.g. units that have not been associated with a plan)

        const [beginYear, beginQuarter] = this.getYearAndQuarterFromDate(
          item.beginDate,
        );
        const [endYear, endQuarter] = this.getYearAndQuarterFromDate(
          item.endDate,
        );
        return {
          id: uuid(),
          beginYear,
          beginQuarter,
          endYear,
          endQuarter,
          items: [item],
        };
      })
      .filter(item => item !== null);
  }

  async importMpPlan(
    payload: UpdateMonitorPlanDTO,
    userId: string,
    draft = false,
  ) {
    if (draft) {
      this.logger.log('Formulating a draft monitor plan');
    } else {
      this.logger.log('Importing monitor plan');
    }

    const facilityId = await this.plantService.getFacIdFromOris(
      payload.orisCode,
    );

    let result: {
      endedPlans: MonitorPlanDTO[];
      newPlans: MonitorPlanDTO[];
    } = { endedPlans: [], newPlans: [] };

    // Start a transaction.
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const trx = queryRunner.manager;

      /* MONITOR LOCATION MERGE LOGIC */

      this.logger.log('Importing monitor locations');
      await this.monitorLocationService.importMonitorLocations(
        payload,
        facilityId,
        userId,
        trx,
      );

      /* UNIT STACK CONFIGURATION MERGE LOGIC */

      this.logger.log('Importing unit stack configurations');
      await this.unitStackService.importUnitStacks(
        payload,
        facilityId,
        userId,
        trx,
      );

      /* MONITOR PLAN MERGE LOGIC */

      // Calculate a list of working plans from the database via transaction state.
      const workingPlans = this.mergePartialConfigurations(
        this.mapItemsToWorkingPlans([
          ...(await this.unitWorkspaceService.getUnitsByFacId(facilityId, trx)),
          ...(await this.unitStackService.getUnitStackConfigurationsByFacId(
            facilityId,
            trx,
          )),
        ]),
      );

      // Check the configurations for validity.
      this.runConfigurationChecks(workingPlans);

      // Get a list of existing monitor plans from the database (outside of the transaction).
      const existingPlans = await this.repository.find({
        where: { facId: facilityId },
        relations: {
          locations: {
            unit: true,
            stackPipe: true,
          },
        },
      });

      // Compare each working plan to the previous database state and update accordingly.
      result = (
        await Promise.all(
          workingPlans.map(workingPlan =>
            this.syncMonitorPlan({
              workingPlan,
              existingPlans,
              facilityId,
              orisCode: payload.orisCode,
              userId,
              trx,
            }),
          ),
        )
      ).reduce((acc, cur) => {
        const { plan, status } = cur;
        if (status === 'new') {
          acc.newPlans.push(plan);
          this.logger.debug('New monitor plan created', {
            mon_plan_id: plan.id,
          });
        } else if (status === 'ended') {
          acc.endedPlans.push(plan);
        }
        return acc;
      }, result);

      /* MONITOR PLAN COMMENT MERGE LOGIC */

      // Apply the monitor plan comments to the earliest changed plan.
      const targetPlan = [...result.newPlans, ...result.endedPlans].reduce(
        (acc, cur) => {
          if (!acc) return cur;
          const compareResult = this.compareReportPeriodDescriptions(
            acc.beginReportPeriodDescription,
            cur.beginReportPeriodDescription,
          );
          if (compareResult === 1) return cur; // If the current plan is earlier than the accumulator, return it.
          return acc;
        },
        null,
      );
      if (targetPlan) {
        await this.monitorPlanCommentService.importComments(
          payload.monitoringPlanCommentData,
          userId,
          targetPlan.id,
          trx,
        );
      }

      if (draft) {
        // Rollback the transaction if the operation is a draft.
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    this.logger.debug('Monitor plan import result', {
      endedPlans: result.endedPlans.map(p => p.id),
      newPlans: result.newPlans.map(p => p.id),
    });
    return result;
  }

  private isUnitDTO(
    item: UnitDTO | UnitStackConfigurationDTO,
  ): item is UnitDTO {
    return !(item as UnitDTO).hasOwnProperty('stackPipeId');
  }

  async revertToOfficialRecord(monPlanId: string) {
    await this.entityManager.transaction(async trx => {
      const repository = withTransaction(this.repository, trx);
      await repository.revertToOfficialRecord(monPlanId);
      const count = await repository
        .createQueryBuilder('mp')
        .where('mp.id = :id', { id: monPlanId })
        .getCount();
      if (count === 0) {
        // The monitor plan only existed in the workspace, clear other references to it.
        await this.userCheckOutService.checkInConfiguration(monPlanId, trx);
      }
    });
  }

  private async matchToPlanByLocationsAndBeginPeriod(
    locationIds: { unitIds: Set<string>; stackPipeIds: Set<string> },
    existingPlans: MonitorPlanWorkspace[],
    beginReportPeriodId: number,
  ) {
    const locationIdsString = Array.from(locationIds.unitIds)
      .concat(Array.from(locationIds.stackPipeIds))
      .sort((a, b) => a.localeCompare(b))
      .join(',');
    const matchedPlan = existingPlans.find(plan => {
      if (plan.beginReportPeriodId !== beginReportPeriodId) return false;

      const planLocationIdsString = plan.locations
        .map(l => l.unit?.name ?? l.stackPipe?.name)
        .sort((a, b) => a.localeCompare(b))
        .join(',');

      if (locationIdsString !== planLocationIdsString) return false;

      return true;
    });

    if (!matchedPlan) return null;

    return this.getMonitorPlan(matchedPlan.id, { full: true });
  }

  private mergePartialConfigurations(
    partialConfigurations: WorkingConfiguration[],
  ): WorkingConfiguration[] {
    if (partialConfigurations.length < 2) {
      return partialConfigurations.map(config =>
        this.normalizeConfigurationPeriods(config),
      );
    }

    const currentConfig = partialConfigurations[0];
    for (const compareConfig of partialConfigurations.slice(1)) {
      if (
        !this.checkLocationsIntersect(currentConfig, compareConfig) ||
        !this.checkPeriodsIntersect(currentConfig, compareConfig)
      ) {
        continue;
      }

      const mergedConfig = this.getMergedConfiguration(
        currentConfig,
        compareConfig,
      );
      if (mergedConfig) {
        return this.mergePartialConfigurations(
          partialConfigurations
            .filter(
              pc => pc.id !== compareConfig.id && pc.id !== currentConfig.id,
            )
            .concat(mergedConfig),
        );
      }
    }
    return [
      this.normalizeConfigurationPeriods(currentConfig),
      ...this.mergePartialConfigurations(partialConfigurations.slice(1)),
    ];
  }

  private normalizeConfigurationPeriods(
    configuration: WorkingConfiguration,
  ): WorkingConfiguration {
    const numberOrNull = (num: number | null) =>
      Number.isFinite(num) ? num : null;
    return {
      ...configuration,
      beginQuarter: numberOrNull(configuration.beginQuarter),
      beginYear: numberOrNull(configuration.beginYear),
      endQuarter: numberOrNull(configuration.endQuarter),
      endYear: numberOrNull(configuration.endYear),
    };
  }

  private runConfigurationChecks(configurations: WorkingConfiguration[]) {
    const errorList: string[] = [];
    configurations.forEach(plan => {
      const { unitUnitIds, unitStackConfigUnitIds } = plan.items.reduce(
        (acc, item) => {
          if (this.isUnitDTO(item)) {
            acc.unitUnitIds.add(item.unitId);
          } else {
            acc.unitStackConfigUnitIds.add(item.unitId);
          }
          return acc;
        },
        {
          unitUnitIds: new Set<string>(),
          unitStackConfigUnitIds: new Set<string>(),
        },
      );
      if (unitUnitIds.size > 1) {
        for (const unitId of unitUnitIds) {
          if (!unitStackConfigUnitIds.has(unitId)) {
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-4-A', {
                unitId: unitId,
              }),
            );
          }
        }
      }
    });
    throwIfErrors(errorList);
  }

  private async syncMonitorPlan({
    existingPlans,
    facilityId,
    orisCode,
    trx,
    userId,
    workingPlan,
  }: {
    existingPlans: MonitorPlanWorkspace[];
    facilityId: number;
    orisCode: number;
    trx: EntityManager;
    userId: string;
    workingPlan: WorkingConfiguration;
  }) {
    // Calculate the report period range from the working monitor plan.
    const planBeginReportPeriodId = (
      await this.reportingPeriodRepository.getByYearQuarter(
        workingPlan.beginYear,
        workingPlan.beginQuarter,
      )
    ).id;
    const planEndReportPeriodId =
      workingPlan.endYear && workingPlan.endQuarter
        ? (
            await this.reportingPeriodRepository.getByYearQuarter(
              workingPlan.endYear,
              workingPlan.endQuarter,
            )
          ).id
        : null;

    // Get the monitoring locations associated with the working plan.
    const locationIds = this.getItemLocationIds(workingPlan.items);

    // Match the working plan to an existing monitor plan by locations and begin period.
    const matchedPlan = await this.matchToPlanByLocationsAndBeginPeriod(
      locationIds,
      existingPlans,
      planBeginReportPeriodId,
    );

    if (matchedPlan) {
      if (!matchedPlan.endReportPeriodId && planEndReportPeriodId) {
        return {
          status: 'ended',
          plan: await this.updateEndReportingPeriod(
            matchedPlan,
            planEndReportPeriodId,
            userId,
            trx,
          ),
        };
      } else {
        return {
          status: 'unchanged',
          plan: matchedPlan,
        };
      }
    } else {
      return {
        status: 'new',
        plan: await this.createMonitorPlan({
          locations: await this.monitorLocationService.getLocationsByUnitStackPipeIds(
            orisCode,
            Array.from(locationIds.unitIds),
            Array.from(locationIds.stackPipeIds),
            trx,
          ),
          facId: facilityId,
          userId,
          beginReportPeriodId: planBeginReportPeriodId,
          endReportPeriodId: planEndReportPeriodId,
          trx,
        }),
      };
    }
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
    const reportingFreqRepository = withTransaction(
      this.reportingFreqRepository,
      trx,
    );

    const planRecord = await repository.findOne({
      where: { id: plan.id },
      relations: { reportingFrequencies: true },
    });
    planRecord.endReportPeriodId = newEndReportPeriodId;
    await repository.save(planRecord);

    // Update the reporting frequency records of the previously active plan.
    const {
      year: updatedEndYear,
      quarter: updatedEndQuarter,
    } = await this.reportingPeriodRepository.getById(newEndReportPeriodId);

    let latestReportingFrequency: MonitorPlanReportingFrequency;
    let latestReportingFrequencyYear: number;
    let latestReportingFrequencyQuarter: number;

    for (const rf of planRecord.reportingFrequencies) {
      // Get the year and quarter of the begin period of the reporting frequency.
      const {
        year: rfBeginYear,
        quarter: rfBeginQuarter,
      } = await this.reportingPeriodRepository.getById(rf.beginReportPeriodId);

      // If the begin period of the reporting frequency is after the updated end period, delete the record.
      if (
        rfBeginYear > updatedEndYear ||
        (rfBeginYear === updatedEndYear && rfBeginQuarter > updatedEndQuarter)
      ) {
        await reportingFreqRepository.delete(rf.id);
      } else if (!latestReportingFrequency) {
        latestReportingFrequency = rf;
      } else if (
        rfBeginYear > latestReportingFrequencyYear ||
        (rfBeginYear === latestReportingFrequencyYear &&
          rfBeginQuarter > latestReportingFrequencyQuarter)
      ) {
        // Compare the reporting frequencies and store the latest one for a later update.
        latestReportingFrequency = rf;
        latestReportingFrequencyYear = rfBeginYear;
        latestReportingFrequencyQuarter = rfBeginQuarter;
      }
    }
    if (
      latestReportingFrequency &&
      latestReportingFrequency.endReportPeriodId !== newEndReportPeriodId
    ) {
      // Update the end report period of the latest reporting frequency.
      reportingFreqRepository.update(latestReportingFrequency.id, {
        endReportPeriodId: newEndReportPeriodId,
        updateDate: currentDateTime(),
        userId,
      });
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

    let REPORTING_FREQ: number,
      COMMENTS: number,
      UNIT_STACK_CONFIGS: number,
      UNIT_CAPACITIES: number,
      UNIT_CONTROLS: number,
      UNIT_FUEL: number,
      ATTRIBUTES: number,
      METHODS: number,
      MATS_METHODS: number,
      FORMULAS: number,
      DEFAULTS: number,
      SPANS: number,
      DUCT_WAFS: number,
      LOADS: number,
      COMPONENTS: number,
      SYSTEMS: number,
      QUALIFICATIONS: number;

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

type ProgramPeriod = [number, number, string]; // [year, quarter, program type]
type ProgramRange = {
  type: 'annual' | 'ozone';
  begin: { year: number; quarter: number } | null;
  end: { year: number; quarter: number } | null;
};
type WorkingConfiguration = {
  id: string;
  beginYear: number;
  beginQuarter: number;
  endYear: number | null;
  endQuarter: number | null;
  items: Array<UnitDTO | UnitStackConfigurationDTO>;
};
