import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeRepository } from './analyzer-range.repository';

@Injectable()
export class AnalyzerRangeService {
  constructor(
    @InjectRepository(AnalyzerRangeRepository)
    private repository: AnalyzerRangeRepository,
    private map: AnalyzerRangeMap,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await this.repository.find({ componentId: compId });
    return this.map.many(results);
  }
}
