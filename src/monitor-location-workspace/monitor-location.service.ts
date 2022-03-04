import { Injectable, NotFoundException } from '@nestjs/common';
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
    private Logger: Logger,
    private errorMsg: 'Monitor Location Not Found',
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      this.Logger.error(NotFoundException, this.errorMsg, true, {
        locationId,
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
