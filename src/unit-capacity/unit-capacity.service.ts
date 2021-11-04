import { Injectable } from '@nestjs/common';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityService {
  constructor(
    private readonly repository: UnitCapacityRepository,
    private readonly map: UnitCapacityMap,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    const results = await this.repository.getUnitCapacities(locId, unitId);

    return this.map.many(results);
  }
}
