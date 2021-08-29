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
}
