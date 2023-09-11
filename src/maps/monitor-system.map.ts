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
    private systsemComponentMap: SystemComponentMap,
  ) {
    super();
  }

  public async one(entity: MonitorSystem): Promise<MonitorSystemDTO> {
    const monitoringSystemComponentData = entity.monitoringSystemComponentData
      ? await this.systsemComponentMap.many(
          entity.monitoringSystemComponentData,
        )
      : [];
    const monitoringSystemFuelFlowData = entity.monitoringSystemFuelFlowData
      ? await this.fuelFlowMap.many(entity.monitoringSystemFuelFlowData)
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
