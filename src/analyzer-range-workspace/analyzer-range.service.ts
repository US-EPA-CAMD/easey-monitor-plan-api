import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyzerRangeDTO } from 'src/dtos/analyzer-range.dto';
import { AnalyzerRangeMap } from 'src/maps/analyzer-range.map';

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
}
