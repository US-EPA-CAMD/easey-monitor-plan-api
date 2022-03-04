import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

@Injectable()
export class UnitStackConfigurationWorkspaceService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private readonly map: UnitStackConfigurationMap,
  ) {}

  async getUnitStackRelationships(hasUnit: Boolean, id: string) {
    let relationship: any;

    if (hasUnit) {
      relationship = await this.repository.find({
        unitId: +id,
      });
    } else {
      relationship = await this.repository.find({
        where: {
          stackPipeId: id,
        },
        order: {
          unitId: 'ASC',
        },
      });
    }

    return this.map.many(relationship);
  }
}
