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
      p.monitoringLocationData = monPlan.monitoringLocationData;
      p.unitStackConfigurationData = monPlan.unitStackConfigurationData;
      p.monitoringLocationData.forEach(l => {
        delete l.monitoringLocationAttribData;
        delete l.unitCapacityData;
        delete l.unitControlData;
        delete l.unitFuelData;
        delete l.monitoringMethodData;
        delete l.supplementalMATSMonitoringMethodData;
        delete l.monitoringFormulaData;
        delete l.monitoringDefaultData;
        delete l.monitoringSpanData;
        delete l.rectangularDuctWAFData;
        delete l.monitoringLoadData;
        delete l.componentData;
        delete l.monitoringSystemData;
        delete l.monitoringQualificationData;
      });
      delete p.monitoringPlanCommentData;
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

    if (orisCodesAndTime.changedOrisCodes.length === 0) {
      dto.changedConfigs = [];
      dto.mostRecentUpdate = null;
      return dto;
    }

    orisCodesAndTime.changedOrisCodes.forEach(orisCode => {
      promises.push(this.pushToChangedConfigList(list, orisCode));
    });

    await Promise.all(promises);

    const est = orisCodesAndTime.mostRecentUpdate.toLocaleString('en-us', {
      timeZone: 'America/New_York',
    });

    const inputDate = new Date(est);

    // Convert to the desired format
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate() - 1).padStart(2, '0'); // Subtract 1 from the day
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');

    const outputDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    dto.changedConfigs = list;
    dto.mostRecentUpdate = outputDateString;

    return dto;
  }
}
