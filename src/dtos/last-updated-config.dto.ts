import { IsDateString } from 'class-validator';
import { MonitorPlan } from '../entities/monitor-plan.entity';

export class LastUpdatedConfigDTO {
  changedConfigs: MonitorPlan[];

  @IsDateString()
  mostRecentUpdate: string;
}
