import { LinkDTO } from './link.dto';
export class MonitorLocationDTO {
  constructor(id: string, name: string, type: string, links: Array<LinkDTO>) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.links = links;
  }
  id: string;
  name: string;
  type: string;
  links: Array<LinkDTO>;
}
