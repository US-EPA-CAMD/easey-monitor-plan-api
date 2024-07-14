import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@Injectable()
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlan, entityManager);
  }

  async createMonitorPlanRecord(
    facId: number,
    userId: string,
    beginReportPeriodId: number,
    endReportPeriodId: number,
  ) {
    const monitorPlan = this.create({
      id: uuid(),
      addDate: currentDateTime(),
      beginReportPeriodId,
      endReportPeriodId,
      evalStatusCode: 'EVAL',
      facId,
      lastUpdated: currentDateTime(),
      needsEvalFlag: 'Y',
      submissionAvailabilityCode: 'GRANTED',
      updateDate: currentDateTime(),
      updatedStatusFlag: 'Y',
      userId,
    });

    return await this.save(monitorPlan);
  }

  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plant.orisCode = :orisCode', { orisCode })
      .getMany();
  }

  async getMonitorPlansByOrisCodes(
    orisCodes: number[],
  ): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect(
        'plan.plant',
        'plant',
        'plant.orisCode IN (:...orisCodes)',
        {
          orisCodes,
        },
      )
      .getMany();
  }

  async getMonitorPlanByIds(planIds: string[]): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plan.id IN (:...planIds)', { planIds })
      .getMany();
  }

  async revertToOfficialRecord(monPlanId: string) {
    try {
      await this.query('CALL camdecmpswks.revert_to_official_record($1)', [
        monPlanId,
      ]);
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }

  async updateDateAndUserId(monPlanId: string, userId: string) {
    try {
      const currDate = currentDateTime();
      await this.query(
        'UPDATE camdecmpswks.monitor_plan SET update_date = $1, userid = $2 WHERE mon_plan_id = $3',
        [currDate, userId, monPlanId],
      );
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }

  async getMonitorPlan(planId: string, full = false): Promise<MonitorPlan> {
    return this.findOne({
      where: { id: planId },
      relations: {
        plant: true,
        ...(full
          ? {
              locations: {
                stackPipe: true,
                unit: true,
              },
              reportingFrequencies: true,
            }
          : {}),
      },
    });
  }

  async getActivePlanByLocationId(locId: string): Promise<MonitorPlan> {
    const query = this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.locations', 'locations')
      .where('locations.id = :locId', { locId })
      .andWhere('plan.endReportPeriodId IS NULL');

    return query.getOne();
  }

  async getActivePlansByFacId(facId: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .where('plan.facId =:facId', { facId })
      .andWhere('plan.endReportPeriodId IS NULL')
      .getMany();
  }

  async resetToNeedsEvaluation(planId: string, userId: string) {
    try {
      const currDate = new Date(Date.now());
      const needsEvalStatus = 'EVAL';
      const updatedStatusFlag = 'Y';
      const needsEvalFlag = 'Y';
      const submissionAvailCode = 'GRANTED';
      await this.query(
        'UPDATE camdecmpswks.monitor_plan SET ' +
          'eval_status_cd = $1, ' +
          'last_updated = $2, ' +
          'update_date = $2,' +
          'updated_status_flg = $3, ' +
          'needs_eval_flg = $4, ' +
          'submission_availability_cd = $5, ' +
          'userid = $6 ' +
          'WHERE mon_plan_id = $7',
        [
          needsEvalStatus,
          currDate,
          updatedStatusFlag,
          needsEvalFlag,
          submissionAvailCode,
          userId,
          planId,
        ],
      );
      return this.findOneBy({ id: planId });
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }
}
