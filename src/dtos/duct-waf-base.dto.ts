export class DuctWafBaseDTO {
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
}
