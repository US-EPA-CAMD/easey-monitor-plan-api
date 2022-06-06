import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanWorkspaceService {
  constructor(
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly repository: MonitorSpanWorkspaceRepository,
    private readonly map: MonitorSpanMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
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
    payload: MonitorSpanBaseDTO,
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
    payload: MonitorSpanBaseDTO,
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

  async runSpanChecks(spans: MonitorSpanBaseDTO[]) {
    const errorList: string[] = [];

    let mustBeNull: string[] = [];
    for (const span of spans) {
      if (span.componentTypeCode === 'FLOW') {
        mustBeNull = [
          'mpcValue',
          'mecValue',
          'defaultHighRange',
          'scaleTransitionPoint',
          'spanScaleCode',
        ];
      } else {
        mustBeNull = ['mpfValue', 'flowSpanValue', 'flowFullScaleRange'];
      }

      mustBeNull.forEach(category => {
        if (span[category] !== null) {
          errorList.push(
            'IMPORT10-NONCRIT-A',
            `An extraneous value has been reported for ${category} in the span record for ${span.componentTypeCode}. This value was not imported.`,
          );
        }
      });
    }

    return errorList;
  }

  async importSpan(
    locationId: string,
    spans: MonitorSpanBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const span of spans) {
        promises.push(
          new Promise(async innerResolve => {
            const spanRecord = await this.repository.getSpanByLocIdCompTypeCdBDateBHour(
              locationId,
              span.componentTypeCode,
              span.beginDate,
              span.beginHour,
            );

            if (spanRecord !== undefined) {
              await this.updateSpan(locationId, spanRecord.id, span, userId);
            } else {
              await this.createSpan(locationId, span, userId);
            }

            innerResolve(true);
          }),
        );

        await Promise.all(promises);
        resolve(true);
      }
    });
  }
}
