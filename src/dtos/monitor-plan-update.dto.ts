import { UpdateMonitorPlanCommentDTO } from './monitor-plan-comment-update.dto';
import { UpdateUnitStackConfigurationDTO } from './unit-stack-configuration-update.dto';
import { UpdateMonitorLocationDTO } from './monitor-location-update.dto';

export class UpdateMonitorPlanDTO {
  orisCode: number;
  version: string;
  comments: UpdateMonitorPlanCommentDTO[];
  unitStackConfiguration: UpdateUnitStackConfigurationDTO[];
  locations: UpdateMonitorLocationDTO[];
}
