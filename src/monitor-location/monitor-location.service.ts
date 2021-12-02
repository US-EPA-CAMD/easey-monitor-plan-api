import { Injectable, NotFoundException } from '@nestjs/common';
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
    private Logger: Logger,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Monitor Load Not Found', {
        locationId: locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationRelationships(locId: string) {
    const location = await this.getLocation(locId);

    return this.uscServcie.getUnitStackRelationships(location);
  }
}
