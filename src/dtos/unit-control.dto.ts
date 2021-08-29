import { UnitControlBaseDTO } from './unit-control-base.dto';

export class UnitControlDTO extends UnitControlBaseDTO {
  id: string;
  unitId: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
