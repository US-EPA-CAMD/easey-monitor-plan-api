import { BadRequestException } from '@nestjs/common';
import { LastUpdatedConfigBaseDTO } from '../dtos/last-updated-config-base.dto';
import { Repository, EntityRepository } from 'typeorm';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plant.orisCode = :orisCode', { orisCode })
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
      const currDate = new Date(Date.now());
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
      await this.query(
        'UPDATE camdecmpswks.monitor_plan SET ' +
          'eval_status_cd = $1, ' +
          'last_updated = $2, ' +
          'update_date = $2,' +
          'updated_status_flg = $3, ' +
          'needs_eval_flg = $4, ' +
          'userid = $5 ' +
          'WHERE mon_plan_id = $6',
        [
          needsEvalStatus,
          currDate,
          updatedStatusFlag,
          needsEvalFlag,
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
