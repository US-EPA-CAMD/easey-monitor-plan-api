import { SelectQueryBuilder } from 'typeorm';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorPlan as WorkspaceMonitorPlan } from '../entities/workspace/monitor-plan.entity';

export const addMonitorPlanIdWhere = (
  query: any,
  monitorPlanIds: string[],
): SelectQueryBuilder<MonitorPlan | WorkspaceMonitorPlan> => {
  if (monitorPlanIds) {
    query.andWhere('plan.id IN (:...monitorPlanIds)', { monitorPlanIds });
  }
  return query;
};
