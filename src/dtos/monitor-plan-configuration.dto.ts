import { MonitorPlanDTO } from './monitor-plan.dto';

export class MonitorPlanConfigurationDTO extends MonitorPlanDTO {
  evalStatusCodeDescription: string;

  submissionAvailabilityCodeDescription: string;

  severityCode: string;

  severityDescription: string;
}
