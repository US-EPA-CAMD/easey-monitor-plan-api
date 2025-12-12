import { Injectable } from '@nestjs/common';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorAttributeService {
  constructor(
    private map: MonitorAttributeMap,
    private readonly dataSource: DataSource,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorAttributeRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
