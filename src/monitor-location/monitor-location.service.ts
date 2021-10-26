import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationRepository } from './monitor-location.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorLocationService {
  constructor(
    @InjectRepository(MonitorLocationRepository)
    readonly repository: MonitorLocationRepository,
    readonly map: MonitorLocationMap,
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
}
