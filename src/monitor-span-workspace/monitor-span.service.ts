import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getSpan(locationId: string, spanId: string): Promise<MonitorSpanDTO> {
    const result = await this.repository.getSpan(locationId, spanId);

    if (!result) {
      throw new NotFoundException('Monitor Span not found');
    }

    return this.map.one(result);
  }

  async createSpan(
    locationId: string,
    payload: UpdateMonitorSpanDTO,
  ): Promise<MonitorSpanDTO> {
    const span = this.repository.create({
      id: uuid(),
      componentTypeCode: payload.componentTypeCode,
      spanScaleCode: payload.spanScaleCode,
      spanMethodCode: payload.spanMethodCode,
      mecValue: payload.mecValue,
      mpcValue: payload.mpcValue,
      mpfValue: payload.mpfValue,
      spanValue: payload.spanValue,
      fullScaleRange: payload.flowFullScaleRange,
      spanUnitsOfMeasureCode: payload.spanUnitsOfMeasureCode,
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
}
