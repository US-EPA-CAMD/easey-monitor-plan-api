import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

@Injectable()
export class UnitStackConfigurationWorkspaceService {
  constructor(
    private readonly repository: UnitStackConfigurationWorkspaceRepository,
    private map: UnitStackConfigurationMap,
  ) {}

  async getUnitStackRelationships(location: MonitorLocationDTO) {
    let relationship: any;

    if (location.stackPipeId) {
      console.log('StackPipeId', location.stackPipeId);
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
      console.log('UnitId', location.unitId);
      relationship = await this.repository.find({
        unitId: +location.unitId,
      });
    }

    return this.map.many(relationship);
  }
}
