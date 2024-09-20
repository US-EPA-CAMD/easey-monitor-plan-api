import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';
import { withTransaction } from '../utils';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';

@Injectable()
export class MonitorPlanLocationService {
  constructor(
    private readonly repository: MonitorPlanLocationWorkspaceRepository,
  ) {}

  async createMonPlanLocationRecord(
    planId: string,
    locationId: string,
    trx?: EntityManager,
  ) {
    const repository = withTransaction(this.repository, trx);

    const monitorPlanLocation = repository.create({
      id: uuid(),
      locationId,
      planId,
    });

    return await repository.save(monitorPlanLocation);
  }

  async getMonPlanLocationByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return await this.repository.getMonPlanLocByLocId(locationId);
  }
}
