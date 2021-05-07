export class MonitorLoadDTO {
  id: string;
  monLocId: string;
  loadAnalysisDate: Date;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  maxLoadValue: number;
  secondNormalInd: number;
  upOpBoundary: number;
  lowOpBoundary: number;
  normalLevelCd: string;
  secondLevelCd: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  maxLoadUomCd: string;
}
