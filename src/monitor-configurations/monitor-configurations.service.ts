import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { In, MoreThanOrEqual, getManager } from 'typeorm';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';
import { Plant } from '../entities/plant.entity';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';

@Injectable()
export class MonitorConfigurationsService {
  constructor(
    private readonly locationRepository: MonitorLocationRepository,
    private readonly uscRepository: UnitStackConfigurationRepository,
    private readonly map: MonitorPlanMap,
  ) {}

  async populateLocationsAndStackConfigs(plan: MonitorPlan) {
    const locations = await this.locationRepository.getMonitorLocationsByPlanId(
      plan.id,
    );

    const unitStackConfigs = await this.uscRepository.getUnitStackConfigsByLocationIds(
      locations.map(l => l.id),
    );

    plan.locations = locations;
    plan.unitStackConfigurations = unitStackConfigs;
  }

  async getConfigurations(
    orisCodes: number[],
    monPlanIds: string[] = [],
  ): Promise<MonitorPlanDTO[]> {
    let plans: MonitorPlan[];
    if (monPlanIds.length > 0) {
      plans = await MonitorPlan.find({
        where: { id: In(monPlanIds) },
        relations: ['plant'],
      });
    } else {
      const plants = await Plant.find({ where: { orisCode: In(orisCodes) } });
      plans = await MonitorPlan.find({
        where: { facId: In(plants.map(p => p.id)) },
        relations: ['plant'],
      });
    }

    const promises = [];

    for (const plan of plans) {
      promises.push(this.populateLocationsAndStackConfigs(plan));
    }

    await Promise.all(promises);

    const dto = await this.map.many(plans);

    dto.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });

    return dto;
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

    const clock: Date = (await getManager().query('SELECT now();'))[0].now;
    dto.mostRecentUpdate = clock;

    // Populate the monitor plans that have been changed

    dto.changedConfigs = await MonitorPlan.find({
      where: { updateDate: MoreThanOrEqual(new Date(queryTime)) },
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
