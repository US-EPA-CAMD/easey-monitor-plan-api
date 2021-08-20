export class MonitorSystemDTO {
  id: string;
  monLocId: string;
  systemTypeCode: string;
  systemDesignationCode: string;
  monitoringSystemId: string;
  fuelCode: string;
  beginDate: Date;
  endDate: Date;
  beginHour: number;
  endHour: number;
  active: boolean;
}
