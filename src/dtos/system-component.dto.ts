import { ComponentDTO } from './component.dto';

export class SystemComponentDTO extends ComponentDTO {
  id: string;
  monitoringSystemRecordId: string;
  componentRecordId: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
