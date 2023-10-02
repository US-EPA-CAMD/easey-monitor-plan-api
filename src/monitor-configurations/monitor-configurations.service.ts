import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanService } from '../monitor-plan/monitor-plan.service';
import { MoreThan } from 'typeorm';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MonitorConfigurationsService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private readonly repository: MonitorPlanRepository,
    private readonly uscRepository: UnitStackConfigurationRepository,
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

  async lookupUnitStacks(locations: string[], config: MonitorPlan) {
    config.unitStackConfigurations = await this.uscRepository.getUnitStackConfigsByLocationIds(
      locations,
    );
  }

  async getConfigurationsByLastUpdated(
    queryTime: string,
  ): Promise<LastUpdatedConfigDTO> {
    const dto = new LastUpdatedConfigDTO();

    //Get current date of operation being performed
    const processDate = currentDateTime();

    const year = processDate.getFullYear();
    const month = String(processDate.getMonth() + 1).padStart(2, '0');
    const day = String(processDate.getDate() - 1).padStart(2, '0'); // Subtract 1 from the day
    const hours = String(processDate.getHours()).padStart(2, '0');
    const minutes = String(processDate.getMinutes()).padStart(2, '0');
    const seconds = String(processDate.getSeconds()).padStart(2, '0');

    const outputDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    dto.mostRecentUpdate = outputDateString;

    // Populate the monitor plans that have been changed

    dto.changedConfigs = await MonitorPlan.find({
      where: { updateDate: MoreThan(new Date(queryTime)) },
      relations: ['locations', 'comments', 'reportingFrequencies'],
    });

    const promises = [];

    let locationList;
    for (const config of dto.changedConfigs) {
      locationList = [];
      for (const loc of config.locations) {
        if (loc.plans) {
          //Data cleanup, only return what ERG needs
          delete loc.plans;
        }

        if (loc.unit) {
          delete loc.unit.unitStackConfigurations;
          delete loc.unit.opStatuses;
          delete loc.unit.unitBoilerType;
        }
        locationList.push(loc.id);
      }
      promises.push(this.lookupUnitStacks(locationList, config));
    }

    await Promise.all(promises);

    return dto;
  }
}
