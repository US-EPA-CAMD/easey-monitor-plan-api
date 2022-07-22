import { MonitorPlanReportingFrequency } from '../entities/monitor-plan-reporting-freq.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorPlanReportingFrequency)
export class MonitorPlanReportingFrequencyRepository extends Repository<
  MonitorPlanReportingFrequency
> {}
