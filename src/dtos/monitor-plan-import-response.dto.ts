import { MonitorPlanDTO } from './monitor-plan.dto';

export class MonitorPlanImportResponseDTO {
  endedPlans: MonitorPlanDTO[];

  newPlans: MonitorPlanDTO[];

  unchangedPlans: MonitorPlanDTO[];
}
