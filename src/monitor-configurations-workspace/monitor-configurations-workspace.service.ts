import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { In } from 'typeorm';
import { Plant } from '../entities/workspace/plant.entity';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    private readonly map: MonitorPlanConfigurationMap,
    @InjectRepository(EvalStatusCodeRepository)
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    @InjectRepository(SubmissionsAvailabilityStatusCodeRepository)
    private readonly submissionStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
    private readonly locationRepository: MonitorLocationWorkspaceRepository,
    private readonly uscRepository: UnitStackConfigurationWorkspaceRepository,
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

  async populateDescriptions(plan) {
    plan['evalStatusCodeDescription'] = (
      await this.evalStatusCodeRepository.findOne(plan.evalStatusCode)
    ).evalStatusCodeDescription;

    plan['submissionAvailabilityCodeDescription'] = (
      await this.submissionStatusCodeRepository.findOne(
        plan.submissionAvailabilityCode,
      )
    ).subAvailabilityCodeDescription;
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

    let promises = [];

    for (const plan of plans) {
      promises.push(this.populateLocationsAndStackConfigs(plan));
    }

    await Promise.all(promises);

    promises = [];
    const monPlanDto = await this.map.many(plans);
    for (const plan of monPlanDto) {
      promises.push(this.populateDescriptions(plan));
    }

    await Promise.all(promises);

    monPlanDto.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });

    return monPlanDto;
  }
}
