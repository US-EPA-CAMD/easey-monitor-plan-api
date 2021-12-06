import { query } from 'express';
import { EntityRepository, Repository } from 'typeorm';
import { MonitorPlanReportResult } from '../entities/vw-monitor-plan-report-results.entity';

@EntityRepository(MonitorPlanReportResult)
export class MonitorPlanReportResultRepository extends Repository<
  MonitorPlanReportResult
> {
  async getMPReportResults(planId: string) {
    return this.createQueryBuilder('mprr')
      .andWhere('mprr.planId = :planId', { planId })
      .getMany();
  }
}
