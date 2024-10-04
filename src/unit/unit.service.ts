import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Unit } from '../entities/unit.entity';
import { withTransaction } from '../utils';
import { UnitRepository } from './unit.repository';
import { UnitDTO } from '../dtos/unit.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class UnitService {
  constructor(
    private readonly repository: UnitRepository,
    private readonly logger: Logger,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.setContext('UnitService');
  }

  async getUnits(unitId: number): Promise<UnitDTO[]> {
    return this.getUnitDetails(unitId);
  }

  async runUnitChecks(
    location: UpdateMonitorLocationDTO,
    orisCode: number,
    facilityId: number,
  ): Promise<string[]> {
    const errorList: string[] = [];

    const databaseUnit = await this.repository.findOneBy({
      name: location.unitId,
      facId: facilityId,
    });

    if (!databaseUnit) {
      errorList.push(
        `[IMPORT2-FATAL-A] The database doesn't contain unit ${location.unitId} for Oris Code ${orisCode}`,
      );
    }

    return errorList;
  }

  async importUnit(
    unitRecord: Unit,
    nonLoadI: number,
    userId: string,
    trx?: EntityManager,
  ) {
    if (nonLoadI !== unitRecord.nonLoadBasedIndicator) {
      await withTransaction(this.repository, trx).update(unitRecord.id, {
        nonLoadBasedIndicator: nonLoadI,
        updateDate: currentDateTime(),
        userId,
      });
      this.logger.debug(`Unit ${unitRecord.name} updated`);
    } else {
      this.logger.debug(`Unit ${unitRecord.name} unchanged`);
    }
    return true;
  }

  async getUnitByNameAndFacId(
    nameId: string,
    facilityId: number,
    trx?: EntityManager,
  ): Promise<Unit> {
    return withTransaction(this.repository, trx).findOne({
      where: { name: nameId, facId: facilityId },
    });
  }

  private async getUnitDetails(id: number): Promise<UnitDTO[]> {
    const sql = `
        SELECT
            unt.UNIT_ID as "id",
            unt.UNITID as "unitId",
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
            camd.UNIT unt
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
}
