import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorDefaultRepository } from './monitor-default.repository';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';

@Injectable()
export class MonitorDefaultService {
  constructor(
    @InjectRepository(MonitorDefaultRepository)
    private repository: MonitorDefaultRepository,
    private map: MonitorDefaultMap,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
