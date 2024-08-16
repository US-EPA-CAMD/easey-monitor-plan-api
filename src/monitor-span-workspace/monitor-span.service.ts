import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanWorkspaceService {
  constructor(
    private readonly repository: MonitorSpanWorkspaceRepository,
    private readonly map: MonitorSpanMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {
    this.logger.setContext('MonitorSpanWorkspaceService');
  }

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getSpan(
    locationId: string,
    spanId: string,
    trx?: EntityManager,
  ): Promise<MonitorSpan> {
    const result = await withTransaction(this.repository, trx).getSpan(
      locationId,
      spanId,
    );

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Span not found'),
        HttpStatus.NOT_FOUND,
        {
          locationId: locationId,
          spanId: spanId,
        },
      );
    }

    return result;
  }

  async createSpan({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorSpanBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorSpanDTO> {
    const repository = withTransaction(this.repository, trx);

    const span = repository.create({
      id: uuid(),
      locationId,
      componentTypeCode: payload.componentTypeCode,
      spanScaleCode: payload.spanScaleCode,
      spanMethodCode: payload.spanMethodCode,
      mecValue: payload.mecValue,
      mpcValue: payload.mpcValue,
      mpfValue: payload.mpfValue,
      spanValue: payload.spanValue,
      fullScaleRange: payload.fullScaleRange,
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
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(span);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(span);
  }

  async updateSpan({
    locationId,
    spanId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    spanId: string;
    payload: MonitorSpanBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorSpanDTO> {
    const span = await this.getSpan(locationId, spanId, trx);

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
    span.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(span);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

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
            `[IMPORT10-NONCRIT-A] An extraneous value has been reported for ${category} in the span record for ${span.componentTypeCode}. This value was not imported.`,
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
    trx?: EntityManager,
  ): Promise<boolean> {
    await Promise.all(
      spans.map(async span => {
        const spanRecord = await withTransaction(
          this.repository,
          trx,
        ).getSpanByLocIdCompTypeCdBDateBHour(
          locationId,
          span.componentTypeCode,
          span.spanScaleCode,
          span.beginDate,
          span.beginHour,
          span.endDate,
          span.endHour,
        );

        if (spanRecord) {
          await this.updateSpan({
            locationId,
            spanId: spanRecord.id,
            payload: span,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createSpan({
            locationId,
            payload: span,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );

    this.logger.debug(`Imported ${spans.length} monitor spans`);
    return true;
  }
}
