export class DuctWafDTO {
  id: string;
  monLocId: string;
  wafDeterminedDate: Date;
  wafEffectiveDate: Date;
  wafEffectiveHour: number;
  wafMethodCd: string;
  wafValue: number;
  numTestRuns: number;
  numTraversePointsRef: number;
  ductWidth: number;
  ductDepth: number;
  endDate: Date;
  endHour: number;
  addDate: Date;
  updateDate: Date;
  userId: string;
}
