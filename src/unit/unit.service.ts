import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Unit } from '../entities/unit.entity';
import { UnitMap } from '../maps/unit.map';
import { withTransaction } from '../utils';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(
    private readonly repository: UnitRepository,
    private readonly map: UnitMap,
  ) {}

  async getUnitsByFacId(facId: number) {
    const results = await this.repository.findBy({ facId });
    return this.map.many(results);
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
