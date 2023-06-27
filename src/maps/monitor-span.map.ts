import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
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
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
