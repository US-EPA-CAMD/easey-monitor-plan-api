import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SystemComponentMap } from './system-component.map';
import { SystemFuelFlowMap } from './system-fuel-flow.map';

import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';

@Injectable()
export class MonitorSystemMap extends BaseMap<MonitorSystem, MonitorSystemDTO> {
  constructor(
    private fuelFlowMap: SystemFuelFlowMap,
    private componentMap: SystemComponentMap,
  ) {
    super();
  }

  public async one(entity: MonitorSystem): Promise<MonitorSystemDTO> {
    const components = entity.components
      ? await this.componentMap.many(entity.components)
      : [];
    const fuelFlows = entity.fuelFlows
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
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
      components,
      fuelFlows,
    };
  }
}
