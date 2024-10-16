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

  async getLoadByLocBDateBHour(
    locationId: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorLoad> {
    return this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere(
        `((
        ml.beginDate = :beginDate AND ml.beginHour = :beginHour
      ) OR (
        ml.endDate IS NOT NULL AND ml.endDate = :endDate AND ml.endHour = :endHour
      ))`,
        {
          beginDate,
          beginHour,
          endDate,
          endHour,
        },
      )
      .getOne();
  }
}
