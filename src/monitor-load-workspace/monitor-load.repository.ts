import { Repository, EntityRepository } from 'typeorm';

import { MonitorLoad } from '../entities/workspace/monitor-load.entity';

@EntityRepository(MonitorLoad)
export class MonitorLoadWorkspaceRepository extends Repository<MonitorLoad> {
  async getLoad(locationId: string, id: string): Promise<MonitorLoad> {
    return this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere('ml.id = :id ', { id })
      .getOne();
  }

  async getLoadByLocBDateBHour(
    locationId: string,
    begindDate: Date,
    beginHour: number,
  ): Promise<MonitorLoad> {
    return this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere('ml.beginDate = :beginDate', {
        begindDate,
      })
      .andWhere('ml.beginHour = :beginHour', { beginHour })
      .getOne();
  }
}
