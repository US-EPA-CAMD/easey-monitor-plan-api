import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanConfigurationDTO } from '../dtos/monitor-plan-configuration.dto';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { PlantWorkspaceRepository } from '../plant-workspace/plant.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';
import { EntityManager } from 'typeorm';
import { VwMPLocationsAndUnitStackConfigurationsMap } from '../maps/vw-mp-locations-and-unit-stack-configurations.map';
import { VwMPLocationsAndUnitStackConfigurations } from '../entities/workspace/vw-mp-locations-and-unit-stack-configurations.entity';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly map: MonitorPlanConfigurationMap,
    private readonly vwMPLocationsmap: VwMPLocationsAndUnitStackConfigurationsMap,
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    private readonly submissionStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
    private readonly monitorLocationWorkspaceRepository: MonitorLocationWorkspaceRepository,
    private readonly monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository,
    private readonly plantWorkspaceRepository: PlantWorkspaceRepository,
    private readonly uscWorkspaceRepository: UnitStackConfigurationWorkspaceRepository,
  ) {}

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

    const severity = await this.entityManager.query(
        `SELECT sc.severity_cd_description, sc.severity_cd
          FROM camdecmpswks.monitor_plan p
          JOIN camdecmpswks.check_session cs on cs.chk_session_id = p.chk_session_id
          JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
          WHERE p.mon_plan_id = $1;`,
          [plan.id],
        );

        plan['severityDescription'] = severity?.[0]?.severity_cd_description;
        plan['severityCode'] = severity?.[0]?.severity_cd;

  }
  async populateLocationsAndStackConfigs(plan: MonitorPlan) {
    const [locations, unitStackConfigurations] = await Promise.all([
      this.monitorLocationWorkspaceRepository.getMonitorLocationsByPlanId(
        plan.id,
      ),
      this.uscWorkspaceRepository.getUnitStackConfigsByMonitorPlanId(plan.id),
    ]);
    plan.locations = locations;
    plan.unitStackConfigurations = unitStackConfigurations;
  }

  async getAllConfigurations(): Promise<MonitorPlanDTO[]> {

    const MPLocationsConfigurationsRecords = await this.entityManager.find(
      VwMPLocationsAndUnitStackConfigurations,
    );
    const monPlanDto = await this.vwMPLocationsmap.many(MPLocationsConfigurationsRecords);
    monPlanDto.sort((a, b) => {
      if (a.orisCode !== b.orisCode) {
        return a.orisCode - b.orisCode;
      }

      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) {
        return nameCompare;
      }

      if (a.beginReportPeriodId !== b.beginReportPeriodId) {
        return a.beginReportPeriodId - b.beginReportPeriodId;
      }

      if (a.endReportPeriodId === null && b.endReportPeriodId === null) {
        return 0;
      }
      if (a.endReportPeriodId === null) {
        return 1;
      }
      if (b.endReportPeriodId === null) {
        return -1;
      }
      return a.endReportPeriodId - b.endReportPeriodId;
    });

    return monPlanDto;
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

    await Promise.all(
      plans.map(async plan => this.populateLocationsAndStackConfigs(plan)),
    );

    const monPlanDto = await this.map.many(plans);

    await Promise.all(
      monPlanDto.map(async plan => await this.populateDescriptions(plan)),
    );

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
