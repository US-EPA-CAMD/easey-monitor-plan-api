import { MonitorPlanDTO } from './monitor-plan.dto';

export class LastUpdatedConfigDTO {
  changedConfigs: MonitorPlanDTO[];

  mostRecentUpdate: Date;
}
