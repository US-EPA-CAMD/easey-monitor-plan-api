import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanConfigurationDTO } from '../dtos/monitor-plan-configuration.dto';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { PlantWorkspaceRepository } from '../plant-workspace/plant.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    private readonly map: MonitorPlanConfigurationMap,
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    private readonly submissionStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
    private readonly monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository,
    private readonly plantWorkspaceRepository: PlantWorkspaceRepository,
  ) {}

  async populateStackConfigs(plan: MonitorPlan) {
    const unitStackConfigs = await this.monitorPlanWorkspaceRepository.getMonitorPlanUnitStackConfigs(
      plan.id,
    );

    plan.unitStackConfigurations = unitStackConfigs;
  }

  async populateDescriptions(plan: MonitorPlanConfigurationDTO) {
    plan['evalStatusCodeDescription'] = (
      await this.evalStatusCodeRepository.findOneBy({
        evalStatusCd: plan.evalStatusCode,
      })
    ).evalStatusCodeDescription;

    plan['submissionAvailabilityCodeDescription'] = (
      await this.submissionStatusCodeRepository.findOneBy({
        subAvailabilityCode: plan.submissionAvailabilityCode,
      })
    ).subAvailabilityCodeDescription;
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
      plans = await this.monitorPlanWorkspaceRepository.find({
        where: { id: In(monPlanIds) },
        relations,
      });
    } else {
      const plants = await this.plantWorkspaceRepository.find({
        where: { orisCode: In(orisCodes) },
      });
      plans = await this.monitorPlanWorkspaceRepository.find({
        where: { facId: In(plants.map(p => p.id)) },
        relations,
      });
    }

    let promises = [];

    for (const plan of plans) {
      promises.push(this.populateStackConfigs(plan));
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
