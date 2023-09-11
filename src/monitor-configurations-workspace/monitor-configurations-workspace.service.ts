import { Injectable } from '@nestjs/common';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private readonly repository: MonitorPlanWorkspaceRepository,
    private readonly map: MonitorPlanConfigurationMap,
    private readonly monitorPlanService: MonitorPlanWorkspaceService,
    @InjectRepository(EvalStatusCodeRepository)
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    @InjectRepository(SubmissionsAvailabilityStatusCodeRepository)
    private readonly submissionStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
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

      p.evalStatusCodeDescription = (
        await this.evalStatusCodeRepository.findOne(p.evalStatusCode)
      ).evalStatusCodeDescription;

      p.submissionAvailabilityCodeDescription = (
        await this.submissionStatusCodeRepository.findOne(
          p.submissionAvailabilityCode,
        )
      ).subAvailabilityCodeDescription;

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
}
