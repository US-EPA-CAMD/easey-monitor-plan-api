import { EntityRepository, Repository } from 'typeorm';

import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeWorkspaceRepository extends Repository<
  AnalyzerRange
> {}
