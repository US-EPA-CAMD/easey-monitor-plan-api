import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlanReportingFreqDTO } from '../dtos/monitor-plan-reporting-freq.dto';
import { MonitorPlanReportingFrequency } from '../entities/monitor-plan-reporting-freq.entity';
import { MonitorPlanReportingFrequency as WorkspaceMonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';

@Injectable()
export class MonitorPlanReportingFrequencyMap extends BaseMap<
  MonitorPlanReportingFrequency | WorkspaceMonitorPlanReportingFrequency,
  MonitorPlanReportingFreqDTO
> {
  public async one(
    entity:
      | MonitorPlanReportingFrequency
      | WorkspaceMonitorPlanReportingFrequency,
  ): Promise<MonitorPlanReportingFreqDTO> {
    return {
      id: entity.id,
      reportFrequencyCode: entity.reportFrequencyCode,
      beginReportPeriodId: entity.beginReportPeriodId,
      endReportPeriodId: entity.endReportPeriodId,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      ...(entity.beginReportingPeriod
        ? {
            beginReportPeriodDescription:
              entity.beginReportingPeriod.periodAbbreviation,
          }
        : {}),
      ...(entity.endReportingPeriod
        ? {
            endReportPeriodDescription:
              entity.endReportingPeriod.periodAbbreviation,
          }
        : {}),
    };
  }
}
