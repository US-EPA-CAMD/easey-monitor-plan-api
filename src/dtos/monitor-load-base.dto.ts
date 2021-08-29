export class MonitorLoadBaseDTO {
  maximumLoadValue: number;
  maximumLoadUnitsOfMeasureCode: string;
  lowerOperationBoundary: number;
  upperOperationBoundary: number;
  normalLevelCode: string;
  secondLevelCode: string;
  secondNormalIndicator: number;
  loadAnalysisDate: Date;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
}
