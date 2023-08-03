import { IsDateString } from 'class-validator';
import { MonitorPlanDTO } from './monitor-plan.dto';

export class LastUpdatedConfigDTO {
  changedConfigs: MonitorPlanDTO[];

  @IsDateString()
  mostRecentUpdate: string;
}
