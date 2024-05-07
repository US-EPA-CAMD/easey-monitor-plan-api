import { Injectable } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultRepository } from './monitor-default.repository';

@Injectable()
export class MonitorDefaultService {
  constructor(
    private repository: MonitorDefaultRepository,
    private map: MonitorDefaultMap,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
