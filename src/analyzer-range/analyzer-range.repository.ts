import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';

@Injectable()
export class AnalyzerRangeRepository extends Repository<AnalyzerRange> {
  constructor(entityManager: EntityManager) {
    super(AnalyzerRange, entityManager);
  }

  async getAnalyzerRangesByCompIds(
    componentIds: string[],
  ): Promise<AnalyzerRange[]> {
    return this.createQueryBuilder('ar')
      .innerJoinAndSelect('ar.component', 'c')
      .where('c.id IN (:...componentIds)', { componentIds })
      .getMany();
  }
}
