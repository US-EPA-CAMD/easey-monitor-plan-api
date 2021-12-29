import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationWorkspaceService } from '../unit-stack-configuration-workspace/unit-stack-configuration.service';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationWorkspaceService {
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    readonly repository: MonitorLocationWorkspaceRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationWorkspaceService,
    private readonly logger: Logger,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    let result;
    try {
      result = await this.repository.findOne(locationId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Location Not Found', true, {
        locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationRelationships(locId: string) {
    let location;
    try {
      location = await this.getLocation(locId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.uscServcie.getUnitStackRelationships(location);
  }
}
