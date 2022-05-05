import { Injectable } from '@nestjs/common';
import { Unit } from '../entities/unit.entity';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(private readonly repository: UnitRepository) {}

  async importUnit(unitRecord: Unit, nonLoadBasedIndicator: number) {
    unitRecord.nonLoadBasedIndicator = nonLoadBasedIndicator;
    this.repository.update(unitRecord, unitRecord);
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
