import { Injectable } from '@nestjs/common';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemRepository } from './monitor-system.repository';

@Injectable()
export class MonitorSystemService {
  constructor(
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    });
    return this.map.many(results);
  }
}
