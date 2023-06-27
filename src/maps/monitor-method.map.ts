import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorMethod } from '../entities/monitor-method.entity';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';

@Injectable()
export class MonitorMethodMap extends BaseMap<MonitorMethod, MonitorMethodDTO> {
  public async one(entity: MonitorMethod): Promise<MonitorMethodDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      parameterCode: entity.parameterCode,
      monitoringMethodCode: entity.monitoringMethodCode,
      substituteDataCode: entity.substituteDataCode,
      bypassApproachCode: entity.bypassApproachCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
