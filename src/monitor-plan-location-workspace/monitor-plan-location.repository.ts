import { EntityRepository, Repository } from 'typeorm';
import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';

@EntityRepository(MonitorPlanLocation)
export class MonitorPlanLocationWorkspaceRepository extends Repository<
  MonitorPlanLocation
> {
  async getMonPlanLocByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return this.createQueryBuilder('mpl')
      .where('mpl.locationId = :locationId', {
        locationId,
      })
      .getMany();
  }
}
