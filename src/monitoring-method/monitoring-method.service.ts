import { FindManyOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodRepository } from './monitoring-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';

@Injectable()
export class MonitoringMethodService {
  constructor(@InjectRepository(MonitorMethodRepository)
    private repository: MonitorMethodRepository,
    private map: MonitorMethodMap,    
  ) {}

  async getMonitoringMethods(monLocId: string): Promise<MonitorMethodDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id", "parameterCode", "methodCode", "subDataCode","bypassApproachCode","addDate","endDate" ],
      where: { monLocId: monLocId }
    }
    const [results, totalCount] = await this.repository.findAndCount(findOpts);
    return this.map.many(results);
  }
}
