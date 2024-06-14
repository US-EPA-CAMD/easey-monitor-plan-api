import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';

@Injectable()
export class MonitorPlanLocationService {
  constructor(
    private readonly repository: MonitorPlanLocationWorkspaceRepository,
  ) {}

  async createMonPlanLocationRecord(planId: string, locationId: string) {
    const monitorPlanLocation = this.repository.create({
      id: uuid(),
      locationId,
      planId,
    });

    return await this.repository.save(monitorPlanLocation);
  }

  async getMonPlanLocationByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return await this.repository.getMonPlanLocByLocId(locationId);
  }
}
