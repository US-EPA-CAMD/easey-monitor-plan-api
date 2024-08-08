import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    private readonly repository: AnalyzerRangeWorkspaceRepository,
    private readonly map: AnalyzerRangeMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.findBy({ componentRecordId: compId });
    return this.map.many(results);
  }

  async getAnalyzerRange(
    analyzerRangeId: string,
    trx?: EntityManager,
  ): Promise<AnalyzerRange> {
    const result = await withTransaction(this.repository, trx).findOneBy({
      id: analyzerRangeId,
    });

    if (!result) {
      throw new EaseyException(
        new Error('Analyzer Range Not Found'),
        HttpStatus.NOT_FOUND,
        { analyzerRangeId: analyzerRangeId },
      );
    }

    return result;
  }

  async createAnalyzerRange({
    componentRecordId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    componentRecordId: string;
    payload: AnalyzerRangeBaseDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<AnalyzerRangeDTO> {
    const repository = withTransaction(this.repository, trx);

    const analyzerRange = repository.create({
      id: uuid(),
      componentRecordId,
      analyzerRangeCode: payload.analyzerRangeCode,
      dualRangeIndicator: payload.dualRangeIndicator,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(analyzerRange);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(analyzerRange);
  }

  async updateAnalyzerRange({
    analyzerRangeId,
    payload,
    locationId,
    userId,
    isImport = false,
    trx,
  }: {
    analyzerRangeId: string;
    payload: AnalyzerRangeBaseDTO;
    locationId: string;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<AnalyzerRangeDTO> {
    const analyzerRange = await this.getAnalyzerRange(analyzerRangeId, trx);

    analyzerRange.analyzerRangeCode = payload.analyzerRangeCode;
    analyzerRange.dualRangeIndicator = payload.dualRangeIndicator;
    analyzerRange.beginDate = payload.beginDate;
    analyzerRange.beginHour = payload.beginHour;
    analyzerRange.endDate = payload.endDate;
    analyzerRange.endHour = payload.endHour;
    analyzerRange.userId = userId;
    analyzerRange.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(analyzerRange);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(analyzerRange);
  }

  async importAnalyzerRange(
    componentId: string,
    locationId: string,
    userId: string,
    analyzerRanges: AnalyzerRangeBaseDTO[] = [],
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const analyzerRange of analyzerRanges) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const analyzerRangeRecord = await withTransaction(
                  this.repository,
                  trx,
                ).getAnalyzerRangeByComponentIdAndDate(
                  componentId,
                  analyzerRange,
                );

                if (analyzerRangeRecord) {
                  await this.updateAnalyzerRange({
                    analyzerRangeId: analyzerRangeRecord.id,
                    payload: analyzerRange,
                    locationId,
                    userId,
                    isImport: true,
                    trx,
                  });
                } else {
                  await this.createAnalyzerRange({
                    componentRecordId: componentId,
                    payload: analyzerRange,
                    locationId,
                    userId,
                    isImport: true,
                    trx,
                  });
                }

                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
