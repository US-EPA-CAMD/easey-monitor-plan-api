export class MonitorLoadDTO {
  id: string;
  monLocId: string;
  loadAnalysisDate: Date;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  maximumLoadValue: number;
  secondNormalIndicator: number;
  upperOperationBoundary: number;
  lowerOperationBoundary: number;
  normalLevelCode: string;
  secondLevelCode: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  maximumLoadUnitsOfMeasureCode: string;
  active: boolean;
}
