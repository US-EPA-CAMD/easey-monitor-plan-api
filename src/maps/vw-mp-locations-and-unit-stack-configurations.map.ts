import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { VwMPLocationsAndUnitStackConfigurations } from '../entities/workspace/vw-mp-locations-and-unit-stack-configurations.entity';

@Injectable()
export class VwMPLocationsAndUnitStackConfigurationsMap extends BaseMap<VwMPLocationsAndUnitStackConfigurations, MonitorPlanDTO> {
    public async one(
      entity: VwMPLocationsAndUnitStackConfigurations,
    ): Promise<MonitorPlanDTO> {
      return {
      id: entity.id,
      facId: entity.facId,
      facilityName: entity.facilityName,
      facilityRegistrySystemId: entity.facilityRegistrySystemId,
      configTypeCode: entity.configTypeCode,
      lastUpdated: entity.lastUpdated,
      updatedStatusFlag: entity.updatedStatusFlag,
      needsEvalFlag: entity.needsEvalFlag,
      checkSessionId: entity.checkSessionId,
      orisCode: entity.orisCode,
      name: entity.name,
      beginReportPeriodId: entity.beginReportPeriodId,
      endReportPeriodId: entity.endReportPeriodId,
      beginReportPeriodDescription: entity.beginReportPeriodDescription,
      endReportPeriodDescription: entity.endReportPeriodDescription,
      active: entity.endReportPeriodId === null ? true : false,
      pendingStatusCode: entity.pendingStatusCode,
      evalStatusCode: entity.evalStatusCode,
      evalStatusCodeDescription: entity.evalStatusCodeDescription?? '',
      severityCode: entity.severityCode,
      severityDescription: entity.severityDescription,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      submissionId: entity.submissionId,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      submissionAvailabilityCodeDescription: '',
      lastEvaluatedDate: entity.lastEvaluatedDate,
      monitoringPlanCommentData: [], 
      unitStackConfigurationData: [], 
      reportingFrequencies: [], 
      monitoringLocationData: [],
      };
    }
}