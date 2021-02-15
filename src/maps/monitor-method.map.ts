import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorMethodData } from '../entities/monitor-method.entity';
import { MonitorMethodDTO } from '../dtos/monitor-method.dto';

@Injectable()
export class MonitorMethodMap extends BaseMap<MonitorMethodData, MonitorMethodDTO> {
  public async one(entity: MonitorMethodData): Promise<MonitorMethodDTO> {
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
      active: false,
    };
  }
}
