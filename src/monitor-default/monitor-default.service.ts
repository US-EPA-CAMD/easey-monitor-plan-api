import { Injectable } from '@nestjs/common';

import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefaultRepository } from './monitor-default.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorDefaultService {
  constructor(
    private repository: MonitorDefaultRepository,
    private map: MonitorDefaultMap,
    private readonly dataSource: DataSource,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorDefaultRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
