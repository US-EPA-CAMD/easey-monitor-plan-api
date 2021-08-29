import { SystemComponentBaseDTO } from './system-component-base.dto';

export class SystemComponentDTO extends SystemComponentBaseDTO {
  id: string;
  locationId: string;
  monitoringSystemRecordId: string;
  componentRecordId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
