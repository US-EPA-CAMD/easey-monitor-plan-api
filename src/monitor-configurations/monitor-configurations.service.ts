import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { PlantRepository } from '../plant/plant.repository';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { EntityManager, In, MoreThanOrEqual } from 'typeorm';
import { UnitStackConfigurationRepository } from '../unit-stack-configuration/unit-stack-configuration.repository';

@Injectable()
export class MonitorConfigurationsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly monitorPlanRepository: MonitorPlanRepository,
    private readonly plantRepository: PlantRepository,
    private readonly uscRepository: UnitStackConfigurationRepository,
    private readonly map: MonitorPlanMap,
  ) {}

  async populateStackConfigs(plan: MonitorPlan) {
    const unitStackConfigs = await this.monitorPlanRepository.getMonitorPlanUnitStackConfigs(
      plan.id,
    );

    plan.unitStackConfigurations = unitStackConfigs;
  }

  async getConfigurations(
    orisCodes: number[],
    monPlanIds: string[] = [],
  ): Promise<MonitorPlanDTO[]> {
    let plans: MonitorPlan[];
    const relations = {
      beginReportingPeriod: true,
      endReportingPeriod: true,
      plant: true,
      locations: {
        unit: {
          opStatuses: true,
        },
        stackPipe: true,
      },
    };
    if (monPlanIds.length > 0) {
      plans = await this.monitorPlanRepository.find({
        where: { id: In(monPlanIds) },
        relations,
      });
    } else {
      const plants = await this.plantRepository.find({
        where: { orisCode: In(orisCodes) },
      });
      plans = await this.monitorPlanRepository.find({
        where: { facId: In(plants.map(p => p.id)) },
        relations,
      });
    }

    const promises = [];

    for (const plan of plans) {
      promises.push(this.populateStackConfigs(plan));
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

    const clock: Date = (await this.entityManager.query('SELECT now();'))[0]
      .now;
    dto.mostRecentUpdate = clock;

    // Populate the monitor plans that have been changed

    dto.changedConfigs = await this.monitorPlanRepository.find({
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
