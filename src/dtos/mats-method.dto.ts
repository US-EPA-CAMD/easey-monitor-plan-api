import { MatsMethodBaseDTO } from './mats-method-base.dto';

export class MatsMethodDTO extends MatsMethodBaseDTO {
  id: string;
  locationId: string;
  addDate: Date;
  userId: string;
  updateDate: Date;
  active: boolean;
}
