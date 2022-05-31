import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlanLocation } from '../entities/workspace/monitor-plan-location.entity';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';

@Injectable()
export class MonitorPlanLocationService {
  constructor(
    @InjectRepository(MonitorPlanLocationWorkspaceRepository)
    private readonly repository: MonitorPlanLocationWorkspaceRepository,
  ) {}

  async getMonPlanLocationByLocId(
    locationId: string,
  ): Promise<MonitorPlanLocation[]> {
    return await this.repository.getMonPlanLocByLocId(locationId);
  }
}
