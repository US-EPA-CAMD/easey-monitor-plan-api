import { Injectable } from '@nestjs/common';

import { MonitorAttribute } from '../entities/monitor-attribute.entity';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

@Injectable()
export class MonitorAttributeMap extends BaseMap<
  MonitorAttribute,
  MonitorAttributeDTO
> {
  public async one(entity: MonitorAttribute): Promise<MonitorAttributeDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      ductIndicator: entity.ductIndicator,
      bypassIndicator: entity.bypassIndicator,
      groundElevation: entity.groundElevation,
      stackHeight: entity.stackHeight,
      materialCode: entity.materialCode,
      shapeCode: entity.shapeCode,
      crossAreaFlow: entity.crossAreaFlow,
      crossAreaStackExit: entity.crossAreaStackExit,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
