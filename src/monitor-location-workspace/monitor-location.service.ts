import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Injectable()
export class MonitorLocationWorkspaceService {
  constructor(
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private repository: MonitorLocationWorkspaceRepository,
    private map: MonitorLocationMap,
  ) {}

  async getLocation(locationId: string): Promise<MonitorLocationDTO> {
    const result = await this.repository.findOne(locationId);

    if (!result) {
      throw new NotFoundException('Monitor Load not found');
    }

    return this.map.one(result);
  }
}
