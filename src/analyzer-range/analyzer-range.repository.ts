import { Repository, EntityRepository } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';

@EntityRepository(AnalyzerRange)
export class AnalyzerRangeRepository extends Repository<AnalyzerRange> {
  async getAnalyzerRangesByCompIds(
    componentIds: string[],
  ): Promise<AnalyzerRange[]> {
    return this.createQueryBuilder('ar')
      .innerJoinAndSelect('ar.component', 'c')
      .where('c.id IN (:...componentIds)', { componentIds })
      .getMany();
  }
}
