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

  async getPreviousPeriodId(id: number): Promise<number> {
    const { year, quarter } = await this.getYearAndQuarterFromId(id);
    const prevPeriodQuarter = quarter === 1 ? 4 : quarter - 1;
    const prevPeriodYear = quarter === 1 ? year - 1 : year;
    const res = await this.createQueryBuilder('rp')
      .where('rp.year = :year', { year: prevPeriodYear })
      .andWhere('rp.quarter = :quarter', { quarter: prevPeriodQuarter })
      .getOne();
    return res.id;
  }

  async getYearAndQuarterFromId(
    id: number,
  ): Promise<{ year: number; quarter: number }> {
    const { year, quarter } = await this.createQueryBuilder('rp')
      .where('rp.id = :id', { id })
      .getOne();
    return { year, quarter };
  }
}
