import { EntityRepository, Repository } from 'typeorm';
import { MonitorPlanReportResult } from '../entities/vw-monitor-plan-report-results.entity';

@EntityRepository(MonitorPlanReportResult)
export class MonitorPlanReportResultRepository extends Repository<
  MonitorPlanReportResult
> {
  async getMPReportResuls() {}
}
