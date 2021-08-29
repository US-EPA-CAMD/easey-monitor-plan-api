import { UnitFuelBaseDTO } from './unit-fuel-base.dto';

export class UnitFuelDTO extends UnitFuelBaseDTO {
  id: string;
  unitId: number;
  actualOrProjectCode: string;
  sulfurContent: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
