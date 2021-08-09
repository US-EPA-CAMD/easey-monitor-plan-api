//import { LinkDTO } from './link.dto';

import { MonitorLocationDTO } from './monitor-location.dto';

export class MonitorPlanDTO {
  id: string;
  facId: number;
  name: string;
  endReportPeriodId: number;
  active: boolean;
  locations: MonitorLocationDTO[];
  //links: LinkDTO[];
}
