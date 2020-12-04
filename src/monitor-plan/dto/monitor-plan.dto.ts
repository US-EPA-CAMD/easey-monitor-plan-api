import { LinkDTO } from './link.dto';
import { MonitorLocationDTO } from './monitor-locations.dto';
export class MonitorPlanDTO {
  constructor(
    id: string,
    name: string,
    locations: Array<MonitorLocationDTO>,
    links: Array<LinkDTO>,
    active: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.locations = locations;
    this.links = links;
    this.active = active;
  }
  id: string;
  name: string;
  locations: Array<MonitorLocationDTO>;
  links: Array<LinkDTO>;
  active: boolean;
}
