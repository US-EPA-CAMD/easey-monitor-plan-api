import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationRepository } from './monitor-location.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitStackConfigurationService } from '../unit-stack-configuration/unit-stack-configuration.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class MonitorLocationService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    @InjectRepository(MonitorLocationRepository)
    readonly repository: MonitorLocationRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationService,
    private Logger: Logger,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    console.log(result);

    if (!result) {
      throw new LoggingException(this.errorMsg, HttpStatus.NOT_FOUND, {
        locationId: locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      throw new LoggingException(this.errorMsg, HttpStatus.NOT_FOUND, {
        locationId: locationId,
      });
    }
    return result;
  }

  async getLocationRelationships(locId: string) {
    const location = await this.getLocationEntity(locId);
    const isUnit = location.unit !== null;
    const id = location.unit ? location.unit.id : location.stackPipe.id;
    return this.uscServcie.getUnitStackRelationships(id, isUnit);
  }
}
