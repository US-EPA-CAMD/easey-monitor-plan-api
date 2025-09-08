import { Injectable } from '@nestjs/common';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelService {
  constructor(
    readonly repository: UnitFuelRepository,
    readonly map: UnitFuelMap,
  ) {}

  async getUnitFuels(unitId: number): Promise<UnitFuelDTO[]> {
    const results = await this.repository.getUnitFuels(unitId);
    return this.map.many(results);
  }
}
