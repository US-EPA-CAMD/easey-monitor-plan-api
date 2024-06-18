import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { ReportingPeriod } from '../entities/reporting-period.entity';

@Injectable()
export class ReportingPeriodRepository extends Repository<ReportingPeriod> {
  constructor(entityManager: EntityManager) {
    super(ReportingPeriod, entityManager);
  }

  async getByDate(date: Date): Promise<ReportingPeriod> {
    const dateIso = date.toISOString();
    return await this.createQueryBuilder('rp')
      .where('rp.beginDate <= :date', { date: dateIso })
      .andWhere('rp.endDate >= :date', { date: dateIso })
      .getOne();
  }

  async getById(id: number): Promise<{ year: number; quarter: number }> {
    const { year, quarter } = await this.createQueryBuilder('rp')
      .where('rp.id = :id', { id })
      .getOne();
    return { year, quarter };
  }

  async getByYearQuarter(
    year: number,
    quarter: number,
  ): Promise<ReportingPeriod> {
    return await this.createQueryBuilder('rp')
      .where('rp.year = :year', { year })
      .andWhere('rp.quarter = :quarter', { quarter })
      .getOne();
  }

  async getPreviousPeriodId(id: number): Promise<number> {
    const { year, quarter } = await this.getById(id);
    const prevPeriodQuarter = quarter === 1 ? 4 : quarter - 1;
    const prevPeriodYear = quarter === 1 ? year - 1 : year;
    const res = await this.createQueryBuilder('rp')
      .where('rp.year = :year', { year: prevPeriodYear })
      .andWhere('rp.quarter = :quarter', { quarter: prevPeriodQuarter })
      .getOne();
    return res.id;
  }
}
