import { Injectable } from '@nestjs/common';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadRepository } from './monitor-load.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorLoadService {
  constructor(
    private map: MonitorLoadMap,
    private readonly dataSource: DataSource,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorLoadRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
