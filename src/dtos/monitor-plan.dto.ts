import { MonitorPlanCommentDTO } from './monitor-plan-comment.dto';
import { UnitStackConfigurationDTO } from './unit-stack-configuration.dto';
import { MonitorLocationDTO } from './monitor-location.dto';

export class MonitorPlanDTO {
  id: string;
  orisCode: number;
  facId: number;
  name: string;
  endReportPeriodId: number;
  active: boolean;
  comments: MonitorPlanCommentDTO[];
  unitStackConfiguration: UnitStackConfigurationDTO[];
  locations: MonitorLocationDTO[];
  evalStatusCode: string;
}
