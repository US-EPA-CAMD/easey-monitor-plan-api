import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { UpdateAnalyzerRangeDTO } from '../dtos/update-analyzer-range.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';

import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private repository: AnalyzerRangeWorkspaceRepository,
    private map: AnalyzerRangeMap,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.find({ componentId: compId });
    return this.map.many(results);
  }

  async getAnalyzerRange(analyzerRangeId: string): Promise<AnalyzerRangeDTO> {
    const result = await this.repository.findOne(analyzerRangeId);

    if (!result) {
      throw new NotFoundException('Analyzer Range not found.');
    }

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
