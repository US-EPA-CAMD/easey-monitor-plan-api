import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationService {
  constructor(
    @InjectRepository(MonitorLocationRepository)
    readonly repository: MonitorLocationRepository,
    readonly map: MonitorLocationMap,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      throw new NotFoundException('Monitor Location not found');
    }

    return this.map.one(result);
  }
}
