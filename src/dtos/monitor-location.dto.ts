import { LinkDTO } from './link.dto';

export class MonitorLocationDTO {
  id: string;
  name: string;
  type: string;
  links: Array<LinkDTO>;
}
