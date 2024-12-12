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
    endDate: Date,
  ): Promise<MonitorAttribute> {
    const query = this.createQueryBuilder('ma')
      .where('ma.locationId = :locationId', {
        locationId,
      })
      .andWhere('ma.beginDate = :beginDate', {
        beginDate,
      });
    
    if (endDate !== null) {
      query.andWhere(
        '(ma.endDate = :endDate)',
        { endDate, }
      );
    } else {
      query.andWhere('ma.endDate IS NULL');
    }

    return query.getOne();
  }
}
