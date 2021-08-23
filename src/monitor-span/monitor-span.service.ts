import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanService {
  constructor(
    @InjectRepository(MonitorSpanRepository)
    private repository: MonitorSpanRepository,
    private map: MonitorSpanMap,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
