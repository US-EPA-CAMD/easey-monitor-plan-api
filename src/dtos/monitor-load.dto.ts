import { MonitorLoadBaseDTO } from './monitor-load-base.dto';

export class MonitorLoadDTO extends MonitorLoadBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
