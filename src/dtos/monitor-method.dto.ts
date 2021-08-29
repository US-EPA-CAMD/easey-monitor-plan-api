import { MonitorMethodBaseDTO } from './monitor-method-base.dto';

export class MonitorMethodDTO extends MonitorMethodBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
