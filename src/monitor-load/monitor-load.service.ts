import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadRepository } from './monitor-load.repository';

@Injectable()
export class MonitorLoadService {
  constructor(
    @InjectRepository(MonitorLoadRepository)
    private repository: MonitorLoadRepository,
    private map: MonitorLoadMap,
  ) {}

  async getLoads(monLocId: string): Promise<MonitorLoadDTO[]> {
    const results = await this.repository.find({ monLocId: monLocId });
    return this.map.many(results);
  }
}
