import { Injectable } from '@nestjs/common';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeRepository } from './analyzer-range.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyzerRangeService {
  constructor(
    private readonly map: AnalyzerRangeMap,
    private readonly dataSource: DataSource,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    const results = await useSlaveRepository(this.dataSource, AnalyzerRangeRepository, async (repository) => repository.findBy({ componentRecordId: compId }));
    return this.map.many(results);
  }
}
