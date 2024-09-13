import { Injectable } from '@nestjs/common';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';

import { UnitBaseDTO, UnitDTO } from '../dtos/unit.dto';
import { UnitMap } from '../maps/unit.map';
import { withTransaction } from '../utils';
import { UnitWorkspaceRepository } from './unit.repository';

@Injectable()
export class UnitWorkspaceService {
  constructor(
    private readonly repository: UnitWorkspaceRepository,
    private readonly map: UnitMap,
    private readonly entityManager: EntityManager,
  ) {}

  async getUnits(id: number): Promise<UnitDTO[]> {
    return this.getUnitDetails(id);
  }

  async updateUnit(
    id: number,
    payload: UnitBaseDTO,
    userId: string,
  ): Promise<UnitDTO> {
    const unit = await this.repository.findOneBy({ id });

    unit.nonLoadBasedIndicator = payload.nonLoadBasedIndicator;
    unit.userId = userId;
    unit.updateDate = currentDateTime();

    await this.repository.save(unit);

    const unitDetails = await this.getUnitDetails(id);
    return unitDetails && unitDetails.length > 0 ? unitDetails[0] : null;
  }

  private async getUnitDetails(id: number): Promise<UnitDTO[]> {
    const sql = `
        SELECT
            unt.UNIT_ID as "id",
            camdUnt.UNITID as "unitId",  -- From camd.UNIT
            unt.NON_LOAD_BASED_IND as "nonLoadBasedIndicator",  -- From camdecmpswks.UNIT
            camdUnt.SOURCE_CATEGORY_CD as "sourceCategoryCd",  -- From camd.UNIT
            to_char(camdUnt.COMM_OP_DATE, 'yyyy-mm-dd') AS "commOpDate",  -- From camd.UNIT
            to_char(camdUnt.COMR_OP_DATE, 'yyyy-mm-dd') AS "comrOpDate",  -- From camd.UNIT
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
            uos.OP_STATUS_CD as "opStatusCd",  -- Operational status
            to_char(uos.BEGIN_DATE, 'yyyy-mm-dd') AS "statusBeginDate",  
            unt.USERID as "auditUser",  -- From camdecmpswks.UNIT
            COALESCE(unt.UPDATE_DATE, unt.ADD_DATE) AS "auditDate",  -- From camdecmpswks.UNIT
            true as "active"  
        FROM
            camdecmpswks.UNIT unt  
                JOIN
            camd.UNIT camdUnt ON camdUnt.UNIT_ID = unt.UNIT_ID  
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

    const result = await this.entityManager.query(sql, [id]);
    return result;
  }

  async getUnitsByFacId(facId: number, trx?: EntityManager) {
    const results = await withTransaction(this.repository, trx).find({
      where: { facId },
      relations: {
        location: {
          methods: true,
          plans: true,
        },
        opStatuses: true,
      },
    });
    return this.map.many(results);
  }

  async getUnitsByMonPlanId(monPlanId: string, trx?: EntityManager) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitsByMonPlanId(monPlanId);
    return this.map.many(results);
  }
}
