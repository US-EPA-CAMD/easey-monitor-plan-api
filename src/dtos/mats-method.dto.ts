import { MatsMethodBaseDTO } from './mats-method-base.dto';

export class MatsMethodDTO extends MatsMethodBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
