import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuid } from 'uuid';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { UpdateAnalyzerRangeDTO } from '../dtos/analyzer-range-update.dto';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';

import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private repository: AnalyzerRangeWorkspaceRepository,
    private map: AnalyzerRangeMap,
    private Logger: Logger,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.find({ componentRecordId: compId });
    return this.map.many(results);
  }

  async getAnalyzerRange(analyzerRangeId: string): Promise<AnalyzerRangeDTO> {
    const result = await this.repository.findOne(analyzerRangeId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Analyzer Range Not Found', {
        analyzerRangeId: analyzerRangeId,
      });
    }

    return this.map.one(result);
  }

  async createAnalyzerRange(
    componentRecordId: string,
    payload: UpdateAnalyzerRangeDTO,
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
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(analyzerRange);
    return this.map.one(result);
  }

  async updateAnalyzerRangd(
    analyzerRangeId: string,
    payload: UpdateAnalyzerRangeDTO,
  ): Promise<AnalyzerRangeDTO> {
    const analyzerRange = await this.getAnalyzerRange(analyzerRangeId);

    analyzerRange.analyzerRangeCode = payload.analyzerRangeCode;
    analyzerRange.dualRangeIndicator = payload.dualRangeIndicator;
    analyzerRange.beginDate = payload.beginDate;
    analyzerRange.beginHour = payload.beginHour;
    analyzerRange.endDate = payload.endDate;
    analyzerRange.endHour = payload.endHour;

    const result = await this.repository.save(analyzerRange);

    return this.map.one(result);
  }
}
