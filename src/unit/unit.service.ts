import { Injectable } from '@nestjs/common';
import { Unit } from '../entities/unit.entity';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(private readonly repository: UnitRepository) {}

  async importUnit(
    facilityId: number,
    unitRecord: Unit,
    nonLoadBasedIndicator: number,
  ) {
    unitRecord.nonLoadBasedIndicator = nonLoadBasedIndicator;
    this.updateUnit(facilityId, unitRecord);
  }

  async updateUnit(facId: number, payload: Unit): Promise<Unit> {
    const unitRecord = await this.getUnitByNameAndFacId(payload.name, facId);

    // TODO: Update Unit Record

    const result = await this.repository.save(unitRecord);
    return result;
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
