import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';

@Injectable()
export class MonitorMethodService {
  constructor(@InjectRepository(MonitorMethodRepository)
    private repository: MonitorMethodRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMonitorMethods(monLocId: string): Promise<MonitorMethodDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id", "parameterCode", "methodCode", "subDataCode","bypassApproachCode","beginDate","beginHour","endDate","endHour" ],
      where: { monLocId: monLocId }
    }
    const results = await this.repository.find(findOpts);
    return this.map.many(results);
  }
}
