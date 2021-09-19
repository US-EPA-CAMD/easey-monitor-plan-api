import { EntityRepository, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/workspace/monitor-default.entity';

@EntityRepository(MonitorDefault)
export class MonitorDefaultWorkspaceRepository extends Repository<
  MonitorDefault
> {
  async getDefault(locationId: string, id: string): Promise<MonitorDefault> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.id = :id ', { id })
      .getOne();
  }
}
