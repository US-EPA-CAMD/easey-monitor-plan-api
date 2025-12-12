import { Injectable } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodRepository } from './monitor-method.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorMethodService {
  constructor(
    private map: MonitorMethodMap,
    private readonly dataSource: DataSource,
  ) {}

  async getMethods(locationId: string): Promise<MonitorMethodDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorMethodRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
