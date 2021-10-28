import { Injectable } from '@nestjs/common';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(
    private readonly repository: UnitCapacityWorkspaceRepository,
    private readonly map: UnitCapacityMap,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitCapacityDTO> {
    const results = await this.repository.getUnitCapacities(
      locId,
      unitRecordId,
    );

    return this.map.many(results);
  }
}
