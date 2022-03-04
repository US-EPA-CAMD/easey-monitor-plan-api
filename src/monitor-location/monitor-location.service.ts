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
    private readonly errorMsg: 'Monitor Location Not Found',
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId: locationId,
      });
    }

    return this.map.one(result);
  }

  async hasUnit(locationId: string): Promise<boolean> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
      return false;
    }
    if (result.unit) {
      return true;
    }
    return false;
  }

  async getStackPipeId(locationId: string): Promise<string> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
    }
    if (result.stackPipe) {
      return result.stackPipe.id;
    }
    return '';
  }

  async getUnitId(locationId: string): Promise<string> {
    const result = await this.repository.findOne(locationId);
    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
      });
    }
    if (result.unit) {
      return result.unit.id.toString();
    }
    return '';
  }

  async getLocationRelationships(locId: string) {
    const hasUnit = await this.hasUnit(locId);

    let id = '';

    if (hasUnit) {
      id = await this.getUnitId(locId);
    } else {
      id = await this.getStackPipeId(locId);
    }

    return this.uscServcie.getUnitStackRelationships(hasUnit, id);
  }
}
