import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

@Injectable()
export class MonitorSystemService {
  constructor(@InjectRepository(MonitorSystemRepository)
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
  ) {}

  async getSystems(monLocId: string): Promise<MonitorSystemDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id", "monLocId", "systemType","systemDesignationCode","fuelCode", "beginDate","endDate"],
      where: { monLocId: monLocId }
    }
    const results = await this.repository.find(findOpts);
    return this.map.many(results);
  }
}
