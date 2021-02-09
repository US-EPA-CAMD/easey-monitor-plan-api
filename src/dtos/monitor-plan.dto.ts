import { LinkDTO } from './link.dto';

import { MonitorLocationDTO } from './monitor-location.dto';

export class MonitorPlanDTO {
  id: string;
  name: string;
  locations: Array<MonitorLocationDTO>;
  links: Array<LinkDTO>;
  endReportPeriodId: number;
  active: boolean;
}
