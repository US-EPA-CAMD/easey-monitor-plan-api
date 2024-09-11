import { Injectable } from '@nestjs/common';

import { ReportingFreqWorkspaceRepository } from './reporting-freq.repository';
import { ReportingFreqDTO } from '../dtos/reporting-freq.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReportingFreqWorkspaceService {
  constructor(
    private readonly repository: ReportingFreqWorkspaceRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async getReportingFreqs(locId: string, unitId: number): Promise<ReportingFreqDTO[]> {
    return await this.retrieveReportingFreq(locId, unitId);
  }

  private async retrieveReportingFreq(locId: string, unitId: number): Promise<ReportingFreqDTO[]> {
    const sql = `
        SELECT
            mprf.mon_plan_rf_id AS "id",
            mprf.report_freq_cd AS "reportFrequencyCode",
            string_agg(u.unit_id::text, ', ') AS "monitoringPlanLocations",
            rp_begin.period_abbreviation AS "beginQuarter",
            rp_end.period_abbreviation AS "endQuarter",
            CASE
                WHEN rp_end.end_date IS NULL OR rp_end.end_date > CURRENT_DATE THEN true
                ELSE false
                END AS "active"
        FROM camdecmpswks.monitor_location ml
                 JOIN camdecmpswks.monitor_plan_location mpl
                      ON ml.mon_loc_id = mpl.mon_loc_id
                 JOIN camdecmpswks.monitor_plan_reporting_freq mprf
                      ON mpl.mon_plan_id = mprf.mon_plan_id
                 JOIN camdecmpswks.unit u
                      ON ml.unit_id = u.unit_id
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
