import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';

@Injectable()
export class MonitorPlanLocationWorkspaceRepository extends Repository<
  MonitorPlanLocation
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanLocation, entityManager);
  }

  async getMonPlanLocByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return this.createQueryBuilder('mpl')
      .where('mpl.locationId = :locationId', {
        locationId,
      })
      .getMany();
  }
}
