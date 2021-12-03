import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmpswks.vw_mp_evaluation_results',
})
export class MonitorPlanReportResult {
  @ViewColumn({
    name: 'monitorplanid',
  })
  planId: string;

  @ViewColumn({
    name: 'unitstackinformation',
  })
  unitStackInformation: string;

  @ViewColumn({
    name: 'severitycode',
  })
  severityCode: string;

  @ViewColumn({
    name: 'categorycodedescription',
  })
  categoryCodeDescription: string;

  @ViewColumn({
    name: 'checkcode',
  })
  checkCode: string;

  @ViewColumn({
    name: 'resultmessage',
  })
  resultMessage: string;
}
