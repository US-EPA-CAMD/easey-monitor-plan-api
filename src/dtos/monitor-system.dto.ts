export class MonitorSystemDTO {
  id: string;
  locationId: string;
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
