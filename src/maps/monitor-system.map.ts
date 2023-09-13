import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SystemComponentMap } from './system-component.map';
import { SystemFuelFlowMap } from './system-fuel-flow.map';

import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystem as WorkspaceMonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';

@Injectable()
export class MonitorSystemMap extends BaseMap<
  MonitorSystem | WorkspaceMonitorSystem,
  MonitorSystemDTO
> {
  constructor(
    private fuelFlowMap: SystemFuelFlowMap,
    private systsemComponentMap: SystemComponentMap,
  ) {
    super();
  }

  public async one(
    entity: MonitorSystem | WorkspaceMonitorSystem,
  ): Promise<MonitorSystemDTO> {
    const monitoringSystemComponentData = entity.components
      ? await this.systsemComponentMap.many(entity.components)
      : [];
    const monitoringSystemFuelFlowData = entity.fuelFlows
      ? await this.fuelFlowMap.many(entity.fuelFlows)
      : [];

    return {
      id: entity.id,
      locationId: entity.locationId,
      monitoringSystemId: entity.monitoringSystemId,
      systemTypeCode: entity.systemTypeCode,
      systemDesignationCode: entity.systemDesignationCode,
      fuelCode: entity.fuelCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
      monitoringSystemComponentData,
      monitoringSystemFuelFlowData,
    };
  }
}
