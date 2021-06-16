import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodRepository } from './monitor-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';

@Injectable()
export class MonitorMethodService {
  constructor(
    @InjectRepository(MonitorMethodRepository)
    private repository: MonitorMethodRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMonitorMethods(monLocId: string): Promise<MonitorMethodDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'parameterCode',
        'methodCode',
        'subDataCode',
        'bypassApproachCode',
        'beginDate',
        'beginHour',
        'endDate',
        'endHour',
      ],
      where: { monLocId: monLocId },
    };
    const results = await this.repository.find(findOpts);
    const monMethods = await this.map.many(results);
    return this.setMonitoringMethodStatus(monMethods);
  }

  setMonitoringMethodStatus(
    monitoringMethod: MonitorMethodDTO[],
  ): MonitorMethodDTO[] {
    monitoringMethod.forEach(m => {
      if (m.endDate == null) {
        m.active = true;
      }
    });
    return monitoringMethod;
  }
}
