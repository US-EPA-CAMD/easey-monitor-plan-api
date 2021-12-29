import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityService {
  constructor(
    private readonly repository: UnitCapacityRepository,
    private readonly map: UnitCapacityMap,
    private readonly logger: Logger,
  ) {}

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitCapacities(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
