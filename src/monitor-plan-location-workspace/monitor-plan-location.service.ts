import { Injectable } from '@nestjs/common';

import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';

@Injectable()
export class MonitorPlanLocationService {
  constructor(
    private readonly repository: MonitorPlanLocationWorkspaceRepository,
  ) {}

  async getMonPlanLocationByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return await this.repository.getMonPlanLocByLocId(locationId);
  }
}
