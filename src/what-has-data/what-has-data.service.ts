import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanDataTypes } from '../enums/monitor-plan-data-types.enum';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';

const commonSQL = (schema: string) => {
  return `
    JOIN ${schema}.monitor_plan_location mpl USING (mon_loc_id)
    JOIN (
      SELECT mon_plan_id, string_agg(unit_stack, ', ') AS configuration
      FROM (
        SELECT mon_plan_id, COALESCE(unitid, stack_name) AS unit_stack
        FROM ${schema}.monitor_plan_location mpl
        JOIN ${schema}.monitor_location ml USING(mon_loc_id)
        LEFT JOIN ${schema}.stack_pipe USING(stack_pipe_id)
        LEFT JOIN camd.unit USING(unit_id)
        ORDER BY mon_plan_id, unitid, stack_name
      ) AS d1
      GROUP BY mon_plan_id
    ) AS d USING(mon_plan_id)
    JOIN ${schema}.monitor_plan mp USING(mon_plan_id)
    JOIN camd.plant p USING(fac_id)`;
}

@Injectable()
export class WhatHasDataService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private readonly repository: MonitorPlanRepository,
  ) {}

  async whatHasData(
    dataType: MonitorPlanDataTypes,
    isWorkspace: boolean = false,
  ): Promise<any> {
    let sql = null;
    const schema = isWorkspace ? "camdecmpswks" : "camdecmps";

    switch(dataType) {
      case MonitorPlanDataTypes.ANALYZER_RANGES:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            component_identifier AS "componentId"
          FROM ${schema}.${dataType}
          JOIN ${schema}.component c USING (component_id)
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, component_identifier`;
        break;
      case MonitorPlanDataTypes.QUALS_LEE:
      case MonitorPlanDataTypes.QUALS_LME:
      case MonitorPlanDataTypes.QUALS_PCT:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration
          FROM ${schema}.${dataType}
          JOIN ${schema}.monitor_qualification mq USING (mon_qual_id)
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration`;
        break;
      case MonitorPlanDataTypes.SYSTEM_COMPONENTS:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration
          FROM ${schema}.${dataType}
          JOIN ${schema}.monitor_system ms USING (mon_sys_id)
          ${commonSQL(schema)}
          JOIN ${schema}.component c USING (component_id)
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration`;
        break;
      case MonitorPlanDataTypes.SYSTEM_FUEL_FLOWS:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration,
            system_identifier AS "systemId"
          FROM ${schema}.${dataType}
          JOIN ${schema}.monitor_system ms USING (mon_sys_id)
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration, system_identifier`;
        break;
      case MonitorPlanDataTypes.UNIT_CAPACITY:
      case MonitorPlanDataTypes.UNIT_CONTROL:
      case MonitorPlanDataTypes.UNIT_FUEL:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration
          FROM ${schema}.${dataType}
          JOIN ${schema}.monitor_location ml USING (unit_id)
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration`;
        break;
      default:
        sql = `
          SELECT DISTINCT
            oris_code AS "orisCode",
            facility_name AS "facilityName",
            configuration
          FROM ${schema}.${dataType}
          ${commonSQL(schema)}
          WHERE end_rpt_period_id IS NULL
          ORDER BY oris_code, configuration`;
        break;
    }

    return this.repository.query(sql);
  }
}
