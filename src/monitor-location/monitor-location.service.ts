import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { UnitStackConfigurationService } from '../unit-stack-configuration/unit-stack-configuration.service';
import { MonitorLocationRepository } from './monitor-location.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorLocationService {
  readonly errorMsg: 'Monitor Location Not Found';
  constructor(
    readonly repository: MonitorLocationRepository,
    readonly map: MonitorLocationMap,
    private readonly uscServcie: UnitStackConfigurationService,
    private Logger: Logger,
    private readonly dataSource: DataSource,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await useSlaveRepository(this.dataSource, MonitorLocationRepository, async (repository) => repository.findOneBy({ id: locationId }));

    if (!result) {
      throw new EaseyException(new Error(this.errorMsg), HttpStatus.NOT_FOUND, {
        locationId: locationId,
      });
    }

    return this.map.one(result);
  }

  async getLocationEntity(locationId: string): Promise<MonitorLocation> {
    const result = await this.repository.findOneBy({ id: locationId });
    if (!result) {
      throw new EaseyException(new Error(this.errorMsg), HttpStatus.NOT_FOUND, {
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
