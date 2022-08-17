import { MonitorPlan } from 'src/entities/workspace/monitor-plan.entity';

export class LastUpdatedConfigBaseDTO {
  changedOrisCodes: number[];

  mostRecentUpdate: Date;
}
