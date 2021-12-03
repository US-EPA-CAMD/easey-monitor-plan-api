import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmpswks.vw_mp_evaluation_results',
})
export class MonitorPlanReportResult {
  @ViewColumn()
  unitStackInformation: string;

  @ViewColumn()
  severityCode: string;

  @ViewColumn()
  categoryCodeDescription: string;

  @ViewColumn()
  checkCode: string;

  @ViewColumn()
  resultMessage: string;
}
