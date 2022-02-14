import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorSpanDTO } from '../dtos/monitor-span-update.dto';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanWorkspaceService {
  constructor(
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly repository: MonitorSpanWorkspaceRepository,
    private readonly map: MonitorSpanMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getSpan(locationId: string, spanId: string): Promise<MonitorSpan> {
    const result = await this.repository.getSpan(locationId, spanId);

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Span not found', true, {
        locationId: locationId,
        spanId: spanId,
      });
    }

    return result;
  }

  async createSpan(
    locationId: string,
    payload: UpdateMonitorSpanDTO,
    userId: string,
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
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(span);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(span);
  }

  async updateSpan(
    locationId: string,
    spanId: string,
    payload: UpdateMonitorSpanDTO,
    userId: string,
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
    span.userId = userId;
    span.updateDate = new Date(Date.now());

    await this.repository.save(span);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(span);
  }
}
