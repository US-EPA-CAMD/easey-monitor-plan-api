export class DuctWafDTO {
  id: string;
  locationId: string;
  wafDeterminationDate: Date;
  wafBeginDate: Date;
  wafBeginHour: number;
  wafMethodCode: string;
  wafValue: number;
  numberOfTestRuns: number;
  numberOfTraversePointsWaf: number;
  numberOfTestPorts: number;
  numberOfTraversePointsRef: number;
  ductWidth: number;
  ductDepth: number;
  wafEndDate: Date;
  wafEndHour: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
