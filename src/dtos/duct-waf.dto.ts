import { DuctWafBaseDTO } from './duct-waf-base.dto';

export class DuctWafDTO extends DuctWafBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
