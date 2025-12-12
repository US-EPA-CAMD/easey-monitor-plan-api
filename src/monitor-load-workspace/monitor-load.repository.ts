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

  async getLoadByLogicalKey(
    locationId: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<MonitorLoad | null> {
    return this.createQueryBuilder('ml')
      .where('ml.locationId = :locationId', { locationId })
      .andWhere('ml.beginDate = :beginDate', { beginDate })
      .andWhere('ml.beginHour = :beginHour', { beginHour })
      .getOne();
  }

}
