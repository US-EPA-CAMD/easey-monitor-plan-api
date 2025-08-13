import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorAttribute } from '../entities/workspace/monitor-attribute.entity';

@Injectable()
export class MonitorAttributeWorkspaceRepository extends Repository<
  MonitorAttribute
> {
  constructor(entityManager: EntityManager) {
    super(MonitorAttribute, entityManager);
  }

  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttribute> {
    return this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', { locationId })
      .andWhere('ma.id = :id', { id })
      .getOne();
  }

  async getAttributeByLocIdBeginOrEndDate(
    locationId: string,
    beginDate: Date,
    endDate: Date | null,
  ): Promise<MonitorAttribute | null> {
    const query = this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', { locationId })
      .andWhere('ma.beginDate = :beginDate', { beginDate });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null) {
      const endQuery = this.createQueryBuilder('ma')
        .where('ma.locationId = :locationId', { locationId })
        .andWhere('ma.endDate = :endDate', { endDate });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
