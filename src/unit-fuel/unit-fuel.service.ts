import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelService {
  constructor(
    @InjectRepository(UnitFuelRepository)
    readonly repository: UnitFuelRepository,
    readonly map: UnitFuelMap,
  ) {}

  async getUnitFuels(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitFuelDTO[]> {
    const results = await this.repository.getUnitFuels(locId, unitRecordId);
    return this.map.many(results);
  }
}
