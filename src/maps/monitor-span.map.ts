import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorSpan } from '../entities/monitor-span.entity';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';

@Injectable()
export class MonitorSpanMap extends BaseMap<MonitorSpan, MonitorSpanDTO> {
  public async one(entity: MonitorSpan): Promise<MonitorSpanDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      mpcValue: entity.mpcValue,
      mecValue: entity.mecValue,
      maxLowRange: entity.maxLowRange,
      spanValue: entity.spanValue,
      fullScaleRange: entity.fullScaleRange,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      defaultHighRange: entity.defaultHighRange,
      flowSpanValue: entity.flowSpanValue,
      flowFullScaleRange: entity.flowFullScaleRange,
      componentTypeCd: entity.componentTypeCd,
      spanScaleCd: entity.spanScaleCd,
      spanMethodCd: entity.spanMethodCd,
      userid: entity.userid,
      updateDate: entity.updateDate,
      spanUomCd: entity.spanUomCd,
      active: entity.endDate === null,
    };
  }
}
