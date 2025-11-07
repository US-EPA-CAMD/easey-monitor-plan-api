import { Injectable } from '@nestjs/common';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemRepository } from './monitor-system.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorSystemService {
  constructor(
    private map: MonitorSystemMap,
    private readonly dataSource: DataSource,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorSystemRepository, async (repository) => repository.find({
      where: {
        locationId,
      },
      order: {
        monitoringSystemId: 'ASC',
      },
    }));
    return this.map.many(results);
  }
}
