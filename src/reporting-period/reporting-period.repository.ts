import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ReportingPeriod } from '../entities/reporting-period.entity';

@Injectable()
export class ReportingPeriodRepository extends Repository<ReportingPeriod> {
  constructor(entityManager: EntityManager) {
    super(ReportingPeriod, entityManager);
  }

  async getIdFromDate(date: Date): Promise<number> {
    const dateIso = date.toISOString();
    const res = await this.createQueryBuilder('rp')
      .where('rp.beginDate <= :date', { date: dateIso })
      .andWhere('rp.endDate >= :date', { date: dateIso })
      .getOne();
    return res.id;
  }
}
