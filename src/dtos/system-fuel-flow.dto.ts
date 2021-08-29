import { SystemFuelFlowBaseDTO } from './system-fuel-flow-base.dto';

export class SystemFuelFlowDTO extends SystemFuelFlowBaseDTO {
  id: string;
  monitoringSystemRecordId: string;
  fuelCode: string;
  systemTypeCode: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
