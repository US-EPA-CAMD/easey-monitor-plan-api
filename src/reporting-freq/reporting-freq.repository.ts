import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanReportingFrequency } from '../entities/monitor-plan-reporting-freq.entity';

@Injectable()
export class ReportingFreqRepository extends Repository<MonitorPlanReportingFrequency> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanReportingFrequency, entityManager);
  }

  async getReportingFreq(unitReportingFreqId: string): Promise<MonitorPlanReportingFrequency> {
    const query = this.createQueryBuilder('rf')
      .where('rf.id = :unitReportingFreqId', { unitReportingFreqId });

    return query.getOne();
  }
}
