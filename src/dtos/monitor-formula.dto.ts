export class MonitorFormulaDTO {
  id: string;
  monLocId: string;
  parameterCd: string;
  equationCd: string;
  formulaIdentifier: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  formulaEquation: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
