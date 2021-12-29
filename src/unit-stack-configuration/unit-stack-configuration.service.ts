import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class UnitStackConfigurationService {
  constructor(
    private readonly repository: UnitStackConfigurationRepository,
    private readonly map: UnitStackConfigurationMap,
    private readonly logger: Logger,
  ) {}

  async getUnitStackRelationships(location: MonitorLocationDTO) {
    let relationship: any;

    try {
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
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(relationship);
  }
}
