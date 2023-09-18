import { BadRequestException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
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

  async getMonitorPlan(planId: string): Promise<MonitorPlan> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plan.id = :planId', { planId })
      .getOne();
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
      const submissionAvailCode = 'REQUIRE';
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
      return this.findOne({ id: planId });
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }
}
