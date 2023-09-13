import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlan as WorkspaceMonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationMap } from './monitor-location.map';
import { MonitorPlanCommentMap } from './monitor-plan-comment.map';
import { UnitStackConfigurationMap } from './unit-stack-configuration.map';
import { MonitorPlanReportingFrequencyMap } from './monitor-plan-reporting-freq.map';

@Injectable()
export class MonitorPlanMap extends BaseMap<
  MonitorPlan | WorkspaceMonitorPlan,
  MonitorPlanDTO
> {
  constructor(
    private locationMap: MonitorLocationMap,
    private commentMap: MonitorPlanCommentMap,
    private readonly unitStackConfigurationMap: UnitStackConfigurationMap,
    private readonly reportingFrequencyMap: MonitorPlanReportingFrequencyMap,
  ) {
    super();
  }

  public async one(
    entity: MonitorPlan | WorkspaceMonitorPlan,
  ): Promise<MonitorPlanDTO> {
    const monitoringLocationData = entity.locations
      ? await this.locationMap.many(entity.locations)
      : [];
    const monitoringPlanCommentData = entity.comments
      ? await this.commentMap.many(entity.comments)
      : [];
    const unitStackConfigurationData = entity.unitStackConfigurations
      ? await this.unitStackConfigurationMap.many(
          entity.unitStackConfigurations,
        )
      : [];
    const reportingFrequencies = entity.reportingFrequencies
      ? await this.reportingFrequencyMap.many(entity.reportingFrequencies)
      : [];

    let pendingStatusCode = null;
    let evalStatusCode = null;

    if (entity['pendingStatusCode']) {
      pendingStatusCode = entity['pendingStatusCode'];
    }

    if (entity['evalStatusCode']) {
      evalStatusCode = entity['evalStatusCode'];
    }

    return {
      id: entity.id,
      facId: entity.facId,
      facilityName: entity.plant.name,
      configTypeCode: entity.configTypeCode,
      lastUpdated: entity.lastUpdated,
      updatedStatusFlag: entity.updatedStatusFlag,
      needsEvalFlag: entity.needsEvalFlag,
      checkSessionId: entity.checkSessionId,
      orisCode: entity.plant.orisCode,
      name: monitoringLocationData.map(l => l.name).join(', '),
      beginReportPeriodId: entity.beginReportPeriodId,
      endReportPeriodId: entity.endReportPeriodId,
      active: entity.endReportPeriodId === null ? true : false,
      monitoringPlanCommentData,
      pendingStatusCode,
      evalStatusCode,
      unitStackConfigurationData,
      reportingFrequencies,
      monitoringLocationData,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      submissionId: entity.submissionId,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      lastEvaluatedDate: entity.lastEvaluatedDate,
    };
  }
}
