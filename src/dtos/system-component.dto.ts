import { ComponentDTO } from './component.dto';

export class SystemComponentDTO extends ComponentDTO {
  id: string;
  monSysId: string;
  componentId: string;
  beginDate: Date;
  endDate: Date;
  beginHour: number;
  endHour: number;
  active: boolean;
}
