import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocationMap } from './monitor-location.map';

@Injectable()
export class MonitorPlanMap extends BaseMap<MonitorPlan, MonitorPlanDTO> {
  constructor(private locationMap: MonitorLocationMap) {
    super();
  }

  public async one(entity: MonitorPlan): Promise<MonitorPlanDTO> {
    const locations = await this.locationMap.many(entity.locations);

    return {
      id: entity.id,
      facId: entity.facId,
      orisCode: entity.plant.orisCode,
      name: locations.map(l => l.name).join(', '),
      endReportPeriodId: entity.endReportPeriodId,
      active: entity.endReportPeriodId === null ? true : false,
      comments: null,
      unitStackConfiguration: null,
      locations: locations,
      evalStatusCode: entity.evalStatusCode,
    };
  }
}
