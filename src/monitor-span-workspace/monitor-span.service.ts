import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanWorkspaceService {
  constructor(
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private repository: MonitorSpanWorkspaceRepository,
    private map: MonitorSpanMap,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
