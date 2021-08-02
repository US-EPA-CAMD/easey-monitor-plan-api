import { BadRequestException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoin('plan.plant', 'plant', 'plant.orisCode = :orisCode', {
        orisCode: orisCode,
      })
      .getMany();
  }

  async deletePlan(monPlanId: number) {
    try {
      await this.query('SELECT revert_to_official_record($1)'), [monPlanId];
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }
}
