import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class AnalyzerRangeRepository extends Repository<AnalyzerRange> {
  constructor( entityManager: EntityManager) {
    super(AnalyzerRange, entityManager);
  }

  async getAnalyzerRangesByCompIds(
    componentIds: string[],
  ): Promise<AnalyzerRange[]> {
      return withSlaveConnection(this.manager.connection, async (qr) => {
        return qr.createQueryBuilder(AnalyzerRange, 'ar')
        .innerJoinAndSelect('ar.component', 'c')
        .where('c.id IN (:...componentIds)', { componentIds })
        .getMany();
     });
  }
}
