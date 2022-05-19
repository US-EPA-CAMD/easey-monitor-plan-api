import { EntityRepository, Repository } from 'typeorm';

import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';

@EntityRepository(MonitorAttribute)
export class MonitorAttributeWorkspaceRepository extends Repository<
  MonitorAttribute
> {
  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttribute> {
    return this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', { locationId })
      .andWhere('ma.id = :id', { id })
      .getOne();
  }

  async getAttributeByLocIdAndDate(
    locationId: string,
    beginDate: Date,
  ): Promise<MonitorAttribute> {
    return this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', {
        locationId,
      })
      .andWhere('ma.beginDate = :beginDate', {
        beginDate,
      })
      .getOne();
  }
}
