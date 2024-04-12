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
