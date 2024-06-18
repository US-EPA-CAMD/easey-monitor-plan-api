import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { Unit } from '../entities/unit.entity';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(private readonly repository: UnitRepository) {}

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
        await (trx?.withRepository(this.repository) ?? this.repository).update(
          unitRecord.id,
          {
            nonLoadBasedIndicator: nonLoadI,
          },
        );
        resolve(true);
      })();
    });
  }

  async getUnitByNameAndFacId(
    nameId: string,
    facilityId: number,
    trx?: EntityManager, // Use for transactions
  ): Promise<Unit> {
    return (trx?.withRepository(this.repository) ?? this.repository).findOne({
      where: { name: nameId, facId: facilityId },
    });
  }
}
