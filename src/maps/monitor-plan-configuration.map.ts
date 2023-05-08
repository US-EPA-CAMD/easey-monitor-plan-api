import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlanConfigurationDTO } from '../dtos/monitor-plan-configuration.dto';
import { MonitorPlanMap } from './monitor-plan.map';

@Injectable()
export class MonitorPlanConfigurationMap extends BaseMap<
  MonitorPlan,
  MonitorPlanConfigurationDTO
> {
  constructor(private readonly monitorPlanMap: MonitorPlanMap) {
    super();
  }

  public async one(entity: MonitorPlan): Promise<MonitorPlanConfigurationDTO> {
    const dto = await this.monitorPlanMap.one(entity);
    return {
      ...dto,
      submissionAvailabilityCodeDescription: null,
      evalStatusCodeDescription: null,
    };
  }
}
