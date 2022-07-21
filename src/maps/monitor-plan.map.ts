import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationMap } from './monitor-location.map';
import { MonitorPlanCommentMap } from './monitor-plan-comment.map';
import { UnitStackConfigurationMap } from './unit-stack-configuration.map';

@Injectable()
export class MonitorPlanMap extends BaseMap<MonitorPlan, MonitorPlanDTO> {
  constructor(
    private locationMap: MonitorLocationMap,
    private commentMap: MonitorPlanCommentMap,
    private readonly unitStackConfigurationMap: UnitStackConfigurationMap,
  ) {
    super();
  }

  public async one(entity: MonitorPlan): Promise<MonitorPlanDTO> {
    const locations = entity.locations
      ? await this.locationMap.many(entity.locations)
      : [];
    const comments = entity.comments
      ? await this.commentMap.many(entity.comments)
      : [];
    const unitStackConfiguration = entity.unitStackConfiguration
      ? await this.unitStackConfigurationMap.many(entity.unitStackConfiguration)
      : [];

    return {
      id: entity.id,
      facId: entity.facId,
      orisCode: entity.plant.orisCode,
      name: locations.map(l => l.name).join(', '),
      beginReportPeriodId: entity.beginReportPeriodId,
      endReportPeriodId: entity.endReportPeriodId,
      active: entity.endReportPeriodId === null ? true : false,
      comments,
      unitStackConfiguration,
      locations,
      evalStatusCode: entity.evalStatusCode,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
