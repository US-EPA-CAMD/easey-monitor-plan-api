export class MonitorMethodDTO {
  id: string;
  monLocId: string;
  parameterCode: string;
  methodCode: string;
  subDataCode: string;
  bypassApproachCode: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  active: boolean;
}