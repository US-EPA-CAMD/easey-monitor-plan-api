import { UnitCapacityBaseDTO } from './unit-capacity-base.dto';

export class UnitCapacityDTO extends UnitCapacityBaseDTO {
  id: string;
  unitId: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
