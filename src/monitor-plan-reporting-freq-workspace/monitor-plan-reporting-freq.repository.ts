import { MonitorPlanReportingFrequency } from '../entities/workspace/monitor-plan-reporting-freq.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorPlanReportingFrequency)
export class MonitorPlanReportingFrequencyWorkspaceRepository extends Repository<
  MonitorPlanReportingFrequency
> {}
