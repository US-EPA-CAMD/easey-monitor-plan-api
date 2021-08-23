export class MonitorMethodDTO {
  id: string;
  locationId: string;
  parameterCode: string;
  substituteDataCode: string;
  bypassApproachCode: string;
  monitoringMethodCode: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
