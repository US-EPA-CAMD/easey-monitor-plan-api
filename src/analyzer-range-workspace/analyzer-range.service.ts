import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private readonly repository: AnalyzerRangeWorkspaceRepository,
    private readonly map: AnalyzerRangeMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.find({ componentRecordId: compId });
    return this.map.many(results);
  }

  async getAnalyzerRange(analyzerRangeId: string): Promise<AnalyzerRange> {
    const result = await this.repository.findOne(analyzerRangeId);

    if (!result) {
      throw new EaseyException(
        new Error('Analyzer Range Not Found'),
        HttpStatus.NOT_FOUND,
        { analyzerRangeId: analyzerRangeId },
      );
    }

    return result;
  }

  async createAnalyzerRange(
    componentRecordId: string,
    payload: AnalyzerRangeBaseDTO,
    locationId: string,
    userId: string,
    isImport = false,
  ): Promise<AnalyzerRangeDTO> {
    const analyzerRange = this.repository.create({
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

    await this.repository.save(analyzerRange);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(analyzerRange);
  }

  async updateAnalyzerRange(
    analyzerRangeId: string,
    payload: AnalyzerRangeBaseDTO,
    locationId: string,
    userId: string,
    isImport = false,
  ): Promise<AnalyzerRangeDTO> {
    const analyzerRange = await this.getAnalyzerRange(analyzerRangeId);

    analyzerRange.analyzerRangeCode = payload.analyzerRangeCode;
    analyzerRange.dualRangeIndicator = payload.dualRangeIndicator;
    analyzerRange.beginDate = payload.beginDate;
    analyzerRange.beginHour = payload.beginHour;
    analyzerRange.endDate = payload.endDate;
    analyzerRange.endHour = payload.endHour;
    analyzerRange.userId = userId;
    analyzerRange.updateDate = currentDateTime();

    await this.repository.save(analyzerRange);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(analyzerRange);
  }

  async importAnalyzerRange(
    componentId: string,
    locationId: string,
    analyzerRanges: AnalyzerRangeBaseDTO[],
    userId: string,
  ) {
    if (!analyzerRanges) {
      analyzerRanges = [];
    }
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const analyzerRange of analyzerRanges) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const analyzerRangeRecord = await this.repository.getAnalyzerRangeByComponentIdAndDate(
                  componentId,
                  analyzerRange,
                );

                if (analyzerRangeRecord) {
                  await this.updateAnalyzerRange(
                    analyzerRangeRecord.id,
                    analyzerRange,
                    locationId,
                    userId,
                    true,
                  );
                } else {
                  await this.createAnalyzerRange(
                    componentId,
                    analyzerRange,
                    locationId,
                    userId,
                    true,
                  );
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
