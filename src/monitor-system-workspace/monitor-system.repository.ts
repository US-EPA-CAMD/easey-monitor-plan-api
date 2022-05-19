import { Repository, EntityRepository } from 'typeorm';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

@EntityRepository(MonitorSystem)
export class MonitorSystemWorkspaceRepository extends Repository<
  MonitorSystem
> {
  async getSystemByLocIdSysIdentifier(
    locationId: string,
    monitoringSystemId: string,
  ): Promise<MonitorSystem> {
    return this.createQueryBuilder('ms')
      .where('ms.locationId = :locationId', { locationId })
      .andWhere('ms.monitoringSystemId = :monitoringSystemId', {
        monitoringSystemId,
      })
      .getOne();
  }
}
