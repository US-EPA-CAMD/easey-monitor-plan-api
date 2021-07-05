import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorMethod } from '../entities/monitor-method.entity';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';

@Injectable()
export class MonitorMethodMap extends BaseMap<MonitorMethod, MonitorMethodDTO> {
  public async one(entity: MonitorMethod): Promise<MonitorMethodDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      parameterCode: entity.parameterCode,
      methodCode: entity.methodCode,
      subDataCode: entity.subDataCode,
      bypassApproachCode: entity.bypassApproachCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
