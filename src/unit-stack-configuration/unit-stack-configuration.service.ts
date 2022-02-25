import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';

@Injectable()
export class UnitStackConfigurationService {
  constructor(
    private readonly repository: UnitStackConfigurationRepository,
    private readonly map: UnitStackConfigurationMap,
  ) {}

  async getUnitStackRelationships(location: MonitorLocationDTO) {
    let relationship: any;

    if (location.stackPipeId) {
      relationship = await this.repository.find({
        where: {
          stackPipeId: location.stackPipeId,
        },
        order: {
          unitId: 'ASC',
        },
      });
    }

    if (location.unitId) {
      relationship = await this.repository.find({
        unitId: +location.unitId,
      });
    }

    return this.map.many(relationship);
  }
}
