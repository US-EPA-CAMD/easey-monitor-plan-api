import { EntityRepository, Repository } from 'typeorm';
import { MonitorPlanReportResult } from '../entities/vw-monitor-plan-report-results.entity';

@EntityRepository(MonitorPlanReportResult)
export class MonitorPlanReportResultRepository extends Repository<
  MonitorPlanReportResult
> {
  async getMPReportResults(planId: string) {
    return this.createQueryBuilder('mprr')
      .where('mppr.planId = :planId', { planId })
      .getMany();
  }

  // ccd.process_cd=MP and the cs.mon_plan_id=[mon_plan_id passed to the API]

  // async getMonitorPlan(planId: string): Promise<MonitorPlan> {
  //   return this.createQueryBuilder('plan')
  //     .innerJoinAndSelect('plan.plant', 'plant')
  //     .where('plan.id = :planId', { planId })
  //     .getOne();
  // }
}
