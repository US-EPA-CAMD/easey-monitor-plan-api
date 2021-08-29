import { ComponentBaseDTO } from './component-base.dto';

export class SystemComponentBaseDTO extends ComponentBaseDTO {
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
}
