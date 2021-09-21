import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorSpan } from '../entities/monitor-span.entity';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';

@Injectable()
export class MonitorSpanMap extends BaseMap<MonitorSpan, MonitorSpanDTO> {
  public async one(entity: MonitorSpan): Promise<MonitorSpanDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      componentTypeCode: entity.componentTypeCode,
      spanScaleCode: entity.spanScaleCode,
      spanMethodCode: entity.spanMethodCode,
      mecValue: entity.mecValue,
      mpcValue: entity.mpcValue,
      mpfValue: entity.mpfValue,
      spanValue: entity.spanValue,
      fullScaleRange: entity.fullScaleRange,
      spanUnitsOfMeasureCode: entity.spanUnitsOfMeasureCode,
      scaleTransitionPoint: entity.scaleTransitionPoint,
      defaultHighRange: entity.defaultHighRange,
      flowSpanValue: entity.flowSpanValue,
      flowFullScaleRange: entity.flowFullScaleRange,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      userid: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
