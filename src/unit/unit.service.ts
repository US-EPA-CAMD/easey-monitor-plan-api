import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import { Request } from 'express';
import { EntityManager } from 'typeorm';

import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Unit } from '../entities/unit.entity';
import { withTransaction } from '../utils';
import { UnitRepository } from './unit.repository';
import { UnitMap } from '../maps/unit.map';
import { UnitParamsDTO } from '../dtos/unit.params.dto';

@Injectable()
export class UnitService {
  constructor(
    private readonly repository: UnitRepository,
    private readonly map: UnitMap,
  ) {}

  async getUnits(unitParamsDTO: UnitParamsDTO, req: Request) {
    const { facilityId, page, perPage } = unitParamsDTO;
    try {
      const [results, totalCount] = await this.repository.findAndCount({
        ...(facilityId && { where: { facId: facilityId } }),
        ...(page && perPage && { skip: (page - 1) * perPage, take: perPage }),
      });
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
      return this.map.many(results);
    } catch (err) {
      throw new EaseyException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async importUnit(unitRecord: Unit, nonLoadI: number, trx?: EntityManager) {
    return new Promise(resolve => {
      (async () => {
        await withTransaction(this.repository, trx).update(unitRecord.id, {
          nonLoadBasedIndicator: nonLoadI,
        });
        resolve(true);
      })();
    });
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
}
