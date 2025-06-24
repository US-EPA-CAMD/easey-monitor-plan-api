import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorLoad } from '../entities/workspace/monitor-load.entity';

@Injectable()
export class MonitorLoadWorkspaceRepository extends Repository<MonitorLoad> {
  constructor(entityManager: EntityManager) {
    super(MonitorLoad, entityManager);
  }

  async getLoad(locationId: string, id: string): Promise<MonitorLoad> {
    return this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere('ml.id = :id ', { id })
      .getOne();
  }

  async getLoadByLocBeginOrEndDate(
    locationId: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date | null,
    endHour: number | null,
  ): Promise<MonitorLoad | null> {
    const query = this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere('(ml.beginDate = :beginDate AND ml.beginHour = :beginHour)', {
        beginDate,
        beginHour,
      });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('ml')
        .where('ml.locationId = :locationId', { locationId })
        .andWhere('(ml.endDate = :endDate AND ml.endHour = :endHour)', {
          endDate,
          endHour,
        });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
