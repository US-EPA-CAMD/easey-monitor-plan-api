import { MonitorPlan } from 'src/entities/workspace/monitor-plan.entity';

export class LastUpdatedConfigBaseDTO {
  changedConfigs: MonitorPlan[];

  mostRecentUpdate: Date;
}
