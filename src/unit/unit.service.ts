import { Injectable } from '@nestjs/common';
import { Unit } from '../entities/unit.entity';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(private readonly repository: UnitRepository) {}

  async importUnit(unitRecord: Unit, nonLoadI: number) {
    return new Promise(async resolve => {
      await this.repository.update(unitRecord.id, {
        nonLoadBasedIndicator: nonLoadI,
      });
      resolve(true);
    });
  }

  async getUnitByNameAndFacId(
    nameId: string,
    facilityId: number,
  ): Promise<Unit> {
    return this.repository.findOne({
      where: { name: nameId, facId: facilityId },
    });
  }
}
