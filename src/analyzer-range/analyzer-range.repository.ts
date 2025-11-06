import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';
@Injectable()
export class AnalyzerRangeRepository extends Repository<AnalyzerRange> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(AnalyzerRange, entityManager);
  }

  async getAnalyzerRangesByCompIds(
    componentIds: string[],
  ): Promise<AnalyzerRange[]> {
      return useSlaveQueryRunner(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(AnalyzerRange, 'ar')
        .innerJoinAndSelect('ar.component', 'c')
        .where('c.id IN (:...componentIds)', { componentIds })
        .getMany();
     });
  }
}
