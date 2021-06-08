export class MonitorSpanDTO {
  id: string;
  monLocId: string;
  mpcValue: number;
  mecValue: number;
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
  componentTypeCd: string;
  spanScaleCd: string;
  spanMethodCd: string;
  userid: string;
  updateDate: Date;
  spanUomCd: string;
}