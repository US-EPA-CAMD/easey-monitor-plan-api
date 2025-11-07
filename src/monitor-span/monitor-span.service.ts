import { Injectable } from '@nestjs/common';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanRepository } from './monitor-span.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorSpanService {
  constructor(
    private map: MonitorSpanMap,
    private readonly dataSource: DataSource,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorSpanRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
