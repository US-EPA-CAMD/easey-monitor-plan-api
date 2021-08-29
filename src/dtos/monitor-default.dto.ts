import { MonitorDefaultBaseDTO } from './monitor-default-base.dto';

export class MonitorDefaultDTO extends MonitorDefaultBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
