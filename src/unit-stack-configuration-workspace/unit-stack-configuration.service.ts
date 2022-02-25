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
