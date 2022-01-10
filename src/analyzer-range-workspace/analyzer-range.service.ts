import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuid } from 'uuid';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { UpdateAnalyzerRangeDTO } from '../dtos/analyzer-range-update.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRange } from '../entities/analyzer-range.entity';

import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { validateObject } from '../utils';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private repository: AnalyzerRangeWorkspaceRepository,
    private map: AnalyzerRangeMap,
    private Logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.find({ componentRecordId: compId });
    return this.map.many(results);
  }

  async getAnalyzerRange(analyzerRangeId: string): Promise<AnalyzerRange> {
    const result = await this.repository.findOne(analyzerRangeId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Analyzer Range Not Found', true, {
        analyzerRangeId: analyzerRangeId,
      });
    }

    return result;
  }

  async createAnalyzerRange(
    componentRecordId: string,
    payload: UpdateAnalyzerRangeDTO,
    locationId: string,
    userId: string,
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await validateObject(analyzerRange);
    await this.repository.save(analyzerRange);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(analyzerRange);
  }

  async updateAnalyzerRangd(
    analyzerRangeId: string,
    payload: UpdateAnalyzerRangeDTO,
    locationId: string,
    userId: string,
  ): Promise<AnalyzerRangeDTO> {
    const analyzerRange = await this.getAnalyzerRange(analyzerRangeId);

    analyzerRange.analyzerRangeCode = payload.analyzerRangeCode;
    analyzerRange.dualRangeIndicator = payload.dualRangeIndicator;
    analyzerRange.beginDate = payload.beginDate;
    analyzerRange.beginHour = payload.beginHour;
    analyzerRange.endDate = payload.endDate;
    analyzerRange.endHour = payload.endHour;

    await validateObject(analyzerRange);
    await this.repository.save(analyzerRange);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(analyzerRange);
  }
}
