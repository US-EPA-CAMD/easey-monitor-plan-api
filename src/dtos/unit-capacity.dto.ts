import { UnitCapacityBaseDTO } from './unit-capacity-base.dto';

export class UnitCapacityDTO extends UnitCapacityBaseDTO {
  id: string;
  unitId: number;
  commercialOperationDate: Date;
  operationDate: Date;
  boilerTurbineType: string;
  boilerTurbineBeginDate: Date;
  boilerTurbineEndDate: Date;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
