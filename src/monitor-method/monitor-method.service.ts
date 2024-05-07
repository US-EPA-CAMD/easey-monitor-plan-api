import { Injectable } from '@nestjs/common';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodRepository } from './monitor-method.repository';

@Injectable()
export class MonitorMethodService {
  constructor(
    private repository: MonitorMethodRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMethods(locationId: string): Promise<MonitorMethodDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
