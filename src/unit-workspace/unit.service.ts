import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

import { UnitWorkspaceRepository } from './unit.repository';
import { UnitBaseDTO, UnitDTO } from '../dtos/unit.dto';
import { EntityManager } from 'typeorm';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class UnitWorkspaceService {
  constructor(
    private readonly repository: UnitWorkspaceRepository,
    private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getUnit(locId: string, unitId: number,): Promise<UnitDTO> {
    const unitDetails = await this.getUnitDetails(unitId);
    return unitDetails && unitDetails.length > 0 ? unitDetails[0] : null;
  }

  async getUnits(locId: string, unitId: number,): Promise<UnitDTO[]> {
    return await this.getUnitDetails(unitId);
  }

  async updateUnit(
    locationId: string,
    unitId: number,
    payload: UnitBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<UnitDTO> {
    const unit = await this.repository.findOneBy({ id: unitId });

    unit.nonLoadBasedIndicator = payload.nonLoadBasedIndicator;
    unit.userId = userId;
    unit.updateDate = currentDateTime();

    await this.repository.save(unit);

    await this.mpService.resetToNeedsEvaluation(locationId, userId);

    const unitDetails = await this.getUnitDetails(unitId);
    return unitDetails && unitDetails.length > 0 ? unitDetails[0] : null;
  }

  private async getUnitDetails(unitId: number): Promise<UnitDTO[]> {
    const sql = `
        SELECT
            unt.UNIT_ID as "id",
            unt.UNITID as "unitid",
            unt.NON_LOAD_BASED_IND as "nonLoadBasedIndicator",
            unt.SOURCE_CATEGORY_CD as "sourceCategoryCd",
            to_char(unt.COMM_OP_DATE, 'yyyy-mm-dd') AS "commOpDate",
            to_char(unt.COMR_OP_DATE, 'yyyy-mm-dd') AS "comrOpDate",
            (
                SELECT MAX(ubt.UNIT_TYPE_CD)
                FROM camd.UNIT_BOILER_TYPE ubt
                WHERE COALESCE(ubt.END_DATE, to_date('12/31/9999', 'mm/dd/yyyy')) = (
                    SELECT MAX(COALESCE(sel.END_DATE, to_date('12/31/9999', 'mm/dd/yyyy')))
                    FROM camd.UNIT_BOILER_TYPE sel
                    WHERE sel.UNIT_ID = unt.UNIT_ID
                )
                  AND ubt.UNIT_ID = unt.UNIT_ID
            ) AS "unitTypeCd",
            uos.OP_STATUS_CD as "opStatusCd",
            to_char(uos.BEGIN_DATE, 'yyyy-mm-dd') AS "statusBeginDate",
            unt.USERID as "auditUser",
            COALESCE(unt.UPDATE_DATE, unt.ADD_DATE) AS "auditDate",
            true as "active"
        FROM
            camdecmpswks.UNIT unt
                JOIN
            (
                SELECT
                    UNIT_ID,
                    OP_STATUS_CD,
                    BEGIN_DATE
                FROM
                    camd.UNIT_OP_STATUS s1
                WHERE
                    BEGIN_DATE = (
                        SELECT MAX(BEGIN_DATE)
                        FROM camd.UNIT_OP_STATUS s2
                        WHERE s2.UNIT_ID = s1.UNIT_ID
                    )
            ) AS uos ON uos.UNIT_ID = unt.UNIT_ID
        WHERE
            unt.UNIT_ID = $1
    `;

    const result = await this.entityManager.query(sql, [unitId]);
    return result;
  }
}
