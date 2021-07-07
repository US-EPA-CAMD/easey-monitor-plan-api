import { Repository, EntityRepository } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeRepository extends Repository<AnalyzerRange> {}
