import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemRepository } from './monitor-system.repository';

@Injectable()
export class MonitorSystemService {
  constructor(
    @InjectRepository(MonitorSystemRepository)
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
  ) {}

  async getSystems(monLocId: string): Promise<MonitorSystemDTO[]> {
    const results = await this.repository.find({
      where: {
        monLocId: monLocId,
      },
      order: {
        systemIdentifier: 'ASC',
      },
    });
    return this.map.many(results);
  }
}
