import { MonitorAttributeBaseDTO } from './monitor-attribute-base.dto';

export class MonitorAttributeDTO extends MonitorAttributeBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
