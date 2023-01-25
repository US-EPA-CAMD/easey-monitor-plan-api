import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';

@Injectable()
export class UnitStackConfigurationService {
  constructor(
    private readonly repository: UnitStackConfigurationRepository,
    private readonly map: UnitStackConfigurationMap,
  ) {}

  async getUnitStackRelationships(id: string | number, isUnit: boolean) {
    const relationship = await this.repository.getUnitStackConfigsByUnitId(
      id,
      isUnit,
    );

    return this.map.many(relationship);
  }
}
