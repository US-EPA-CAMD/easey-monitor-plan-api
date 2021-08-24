export class SystemFuelFlowDTO {
  id: string;
  monitoringSystemRecordId: string;
  maximumFuelFlowRate: number;
  systemFuelFlowUOMCode: string;
  maximumFuelFlowRateSourceCode: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
