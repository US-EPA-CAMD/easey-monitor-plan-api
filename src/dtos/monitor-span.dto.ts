export class MonitorSpanDTO {
  id: string;
  locationId: string;
  mecValue: number;
  mpcValue: number;
  mpfValue: number;
  maxLowRange: number;
  spanValue: number;
  fullScaleRange: number;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  defaultHighRange: number;
  flowSpanValue: number;
  flowFullScaleRange: number;
  componentTypeCode: string;
  spanScaleCode: string;
  spanMethodCode: string;
  userid: string;
  updateDate: Date;
  spanUnitsOfMeasureCode: string;
  active: boolean;
}
