import { MonitorSpanBaseDTO } from './monitor-span-base.dto';

export class MonitorSpanDTO extends MonitorSpanBaseDTO {
  id: string;
  locationId: string;
  userid: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
