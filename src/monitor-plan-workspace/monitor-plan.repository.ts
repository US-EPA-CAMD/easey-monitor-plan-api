import { BadRequestException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant', 'plant.orisCode = :orisCode', {
        orisCode: orisCode,
      })
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
}
