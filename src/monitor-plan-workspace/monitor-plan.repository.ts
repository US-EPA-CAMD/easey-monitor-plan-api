import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    const query = this.createQueryBuilder('plan').innerJoin(
      'plan.plant',
      'plant',
      'plant.orisCode = :orisCode',
      { orisCode: orisCode },
    );
    return query.getMany();
  }
}
