import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private readonly repository: MonitorPlanWorkspaceRepository,
    private readonly map: MonitorPlanMap,
    private readonly monitorPlanService: MonitorPlanWorkspaceService,
  ) {}

  private async parseMonitorPlanConfigurations(plans: MonitorPlan[]) {
    if (plans.length === 0) {
      return [];
    }
    const results = await this.map.many(plans);

    for (const p of results) {
      const monPlan = await this.monitorPlanService.exportMonitorPlan(
        p.id,
        false,
        false,
        false,
        true,
      );
      p.name = monPlan.name;
      p.locations = monPlan.locations;
      p.unitStackConfigurations = monPlan.unitStackConfigurations;
      p.locations.forEach(l => {
        delete l.attributes;
        delete l.unitCapacities;
        delete l.unitControls;
        delete l.unitFuels;
        delete l.methods;
        delete l.matsMethods;
        delete l.formulas;
        delete l.defaults;
        delete l.spans;
        delete l.ductWafs;
        delete l.loads;
        delete l.components;
        delete l.systems;
        delete l.qualifications;
      });
      delete p.comments;
      delete p.reportingFrequencies;
    }
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

  async getConfigurations(
    orisCodes: number[],
    monPlanIds: string[] = [],
  ): Promise<MonitorPlanDTO[]> {
    let plans;
    if (monPlanIds.length > 0) {
      plans = await this.repository.getMonitorPlanByIds(monPlanIds);
    } else {
      plans = await this.repository.getMonitorPlansByOrisCodes(orisCodes);
    }

    return this.parseMonitorPlanConfigurations(plans);
  }
}
