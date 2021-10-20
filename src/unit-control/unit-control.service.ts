import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';

import { UnitControlRepository } from './unit-control.repository';

@Injectable()
export class UnitControlService {
  constructor(
    @InjectRepository(UnitControlRepository)
    readonly repository: UnitControlRepository,
    readonly map: UnitControlMap,
  ) {}

  async getUnitControls(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitControlDTO[]> {
    const results = await this.repository.getUnitControls(locId, unitRecordId);
    return this.map.many(results);
  }
}
