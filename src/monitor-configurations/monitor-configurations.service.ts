import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanService } from '../monitor-plan/monitor-plan.service';

@Injectable()
export class MonitorConfigurationsService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private readonly repository: MonitorPlanRepository,
    private readonly map: MonitorPlanMap,
    private readonly monitorPlanService: MonitorPlanService,
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

  async pushToChangedConfigList(list: MonitorPlanDTO[], orisCode: number) {
    list.push(...(await this.getConfigurations([orisCode])));
  }

  async getConfigurationsByLastUpdated(
    queryTime: string,
  ): Promise<LastUpdatedConfigDTO> {
    const dto = new LastUpdatedConfigDTO();

    const orisCodesAndTime = await this.repository.getOrisCodesByLastUpdatedTime(
      queryTime,
    );

    const list: MonitorPlanDTO[] = [];
    const promises = [];

    orisCodesAndTime.changedOrisCodes.forEach(orisCode => {
      promises.push(this.pushToChangedConfigList(list, orisCode));
    });

    await Promise.all(promises);

    dto.changedConfigs = list;
    dto.mostRecentUpdate = orisCodesAndTime.mostRecentUpdate.toLocaleString(
      'en-us',
      { timeZone: 'America/New_York' },
    );

    return dto;
  }
}
