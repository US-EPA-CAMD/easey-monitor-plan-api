import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private repository: MonitorPlanWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private mlRepository: MonitorLocationWorkspaceRepository,
    private map: MonitorPlanMap,
  ) {}

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.repository.getMonitorPlansByOrisCode(orisCode);
    //TODO: error handling here in case no plans returned
    const locations = await this.mlRepository.getMonitorLocationsByFacId(
      plans[0].facId,
    );
    plans.forEach(p => {
      const matchedLocations: MonitorLocation[] = [];
      locations.forEach(l => {
        const planIds = l.plans.map(lp => lp.id);
        if (planIds.includes(p.id)) {
          matchedLocations.push(l);
        }
      });
      p.locations = matchedLocations;
    });
    const results = await this.map.many(plans);
    results.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });
    return results;
  }

  async deletePlan(planId: string): Promise<void> {
    planId;
    // TODO - create a function/procedure to delete all workspace records
    return Promise.resolve();
  }
}
