import { Injectable } from '@nestjs/common';

import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class MonitorPlanReportingFrequencyWorkspaceService {
  constructor(private readonly entityManager: EntityManager) {}

  async getReportingFreqs(unitId: number): Promise<ReportingFreqDTO[]> {
    return await this.retrieveReportingFreq(unitId);
  }

  private async retrieveReportingFreq(
    unitId: number,
  ): Promise<ReportingFreqDTO[]> {
    const sql = `
        SELECT
            mprf.mon_plan_rf_id AS "id",
            mprf.report_freq_cd AS "reportFrequencyCode",
            (
                select  string_agg( coalesce( unt.unitid, stp.stack_name ), ', ' order by stp.stack_name, unt.unitid )
                from  camdecmpswks.MONITOR_PLAN_LOCATION mpl
                          join camdecmpswks.MONITOR_LOCATION loc
                               on loc.mon_loc_id = mpl.mon_loc_id
                          left join camdecmpswks.UNIT unt
                                    on unt.unit_id = loc.unit_id
                          left join camdecmpswks.STACK_PIPE stp
                                    on stp.stack_pipe_id = loc.stack_pipe_id
                where  mpl.mon_plan_id = mprf.mon_plan_id
            ) AS "monitoringPlanLocations",
            rp_begin.period_abbreviation AS "beginQuarter",
            rp_end.period_abbreviation AS "endQuarter",
            CASE
                WHEN rp_end.end_date IS NULL OR rp_end.end_date > CURRENT_DATE THEN true
                ELSE false
                END AS "active"
        FROM camdecmpswks.vw_monitor_location ml
                 JOIN camdecmpswks.monitor_plan_location mpl
                      ON ml.mon_loc_id = mpl.mon_loc_id
                 JOIN camdecmpswks.monitor_plan_reporting_freq mprf
                      ON mpl.mon_plan_id = mprf.mon_plan_id
                 JOIN camdecmpsmd.reporting_period rp_begin
                      ON mprf.begin_rpt_period_id = rp_begin.rpt_period_id
                 LEFT JOIN camdecmpsmd.reporting_period rp_end
                           ON mprf.end_rpt_period_id = rp_end.rpt_period_id
        WHERE ml.unit_id = $1
        GROUP BY mprf.mon_plan_rf_id, mprf.report_freq_cd, rp_begin.period_abbreviation, rp_end.period_abbreviation, rp_end.end_date;
    `;

    const result = await this.entityManager.query(sql, [unitId]);
    return result;
  }
}
