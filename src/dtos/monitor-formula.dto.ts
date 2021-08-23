export class MonitorFormulaDTO {
  id: string;
  locationId: string;
  parameterCode: string;
  equationCode: string;
  formulaId: string;
  beginDate: Date;
  beginHour: number;
  endDate: Date;
  endHour: number;
  formulaText: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
