import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorSpanDTO } from '../dtos/monitor-span-update.dto';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanWorkspaceService {
  constructor(
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private repository: MonitorSpanWorkspaceRepository,
    private map: MonitorSpanMap,
    private Logger: Logger,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getSpan(locationId: string, spanId: string): Promise<MonitorSpanDTO> {
    const result = await this.repository.getSpan(locationId, spanId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Monitor Span not found', true,{
        locationId: locationId,
        spanId: spanId,
      });
    }

    return this.map.one(result);
  }

  async createSpan(
    locationId: string,
    payload: UpdateMonitorSpanDTO,
  ): Promise<MonitorSpanDTO> {
    const span = this.repository.create({
      id: uuid(),
      locationId,
      componentTypeCode: payload.componentTypeCode,
      spanScaleCode: payload.spanScaleCode,
      spanMethodCode: payload.spanMethodCode,
      mecValue: payload.mecValue,
      mpcValue: payload.mpcValue,
      mpfValue: payload.mpfValue,
      spanValue: payload.spanValue,
      fullScaleRange: payload.flowFullScaleRange,
      spanUnitsOfMeasureCode: payload.spanUnitsOfMeasureCode,
      scaleTransitionPoint: payload.scaleTransitionPoint,
      defaultHighRange: payload.defaultHighRange,
      flowSpanValue: payload.flowSpanValue,
      flowFullScaleRange: payload.flowFullScaleRange,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      // TODO
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(span);

    return this.map.one(result);
  }

  async updateSpan(
    locationId: string,
    spanId: string,
    payload: UpdateMonitorSpanDTO,
  ): Promise<MonitorSpanDTO> {
    const span = await this.getSpan(locationId, spanId);

    span.componentTypeCode = payload.componentTypeCode;
    span.spanScaleCode = payload.spanScaleCode;
    span.spanMethodCode = payload.spanMethodCode;
    span.mecValue = payload.mecValue;
    span.mpcValue = payload.mpcValue;
    span.mpfValue = payload.mpfValue;
    span.spanValue = payload.spanValue;
    span.fullScaleRange = payload.fullScaleRange;
    span.spanUnitsOfMeasureCode = payload.spanUnitsOfMeasureCode;
    span.scaleTransitionPoint = payload.scaleTransitionPoint;
    span.defaultHighRange = payload.defaultHighRange;
    span.flowSpanValue = payload.flowSpanValue;
    span.flowFullScaleRange = payload.flowFullScaleRange;
    span.beginDate = payload.beginDate;
    span.beginHour = payload.beginHour;
    span.endDate = payload.endDate;
    span.endHour = payload.endHour;
    // TODO
    span.userid = 'testuser';
    span.updateDate = new Date(Date.now());

    await this.repository.save(span);

    return this.getSpan(locationId, spanId);
  }
}
