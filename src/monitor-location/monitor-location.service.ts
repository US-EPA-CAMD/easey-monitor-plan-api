import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationRepository } from './monitor-location.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationService } from '../unit-stack-configuration/unit-stack-configuration.service';

@Injectable()
export class MonitorLocationService {
  constructor(
    @InjectRepository(MonitorLocationRepository)
    readonly repository: MonitorLocationRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationService,
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
      this.logger.error(NotFoundException, 'Monitor Load Not Found', true, {
        locationId: locationId,
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
