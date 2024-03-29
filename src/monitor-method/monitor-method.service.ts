import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethodRepository } from './monitor-method.repository';

@Injectable()
export class MonitorMethodService {
  constructor(
    @InjectRepository(MonitorMethodRepository)
    private repository: MonitorMethodRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMethods(locationId: string): Promise<MonitorMethodDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
