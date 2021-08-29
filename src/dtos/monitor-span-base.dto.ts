export class MonitorSpanBaseDTO {
  componentTypeCode: string;
  spanScaleCode: string;
  spanMethodCode: string;
  mecValue: number;
  mpcValue: number;
  mpfValue: number;
  spanValue: number;
  fullScaleRange: number;
  spanUnitsOfMeasureCode: string;
  scaleTransitionPoint: string;
  defaultHighRange: number;
  flowSpanValue: number;
  flowFullScaleRange: number;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
}
