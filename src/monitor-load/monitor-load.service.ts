import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorLoadRepository } from './monitor-load.repository';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';

@Injectable()
export class MonitorLoadService {
  constructor(
    @InjectRepository(MonitorLoadRepository)
    private repository: MonitorLoadRepository,
    private map: MonitorLoadMap,
  ) {}

  async getMonitorLoads(monLocId: string): Promise<MonitorLoadDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'monLocId',
        'loadAnalysisDate',
        'beginDate',
        'beginHour',
        'endDate',
        'endHour',
        'maxLoadValue',
        'secondNormalInd',
        'upOpBoundary',
        'lowOpBoundary',
        'normalLevelCd',
        'secondLevelCd',
        'userId',
        'addDate',
        'updateDate',
        'maxLoadUomCd',
      ],
      where: { monLocId: monLocId },
    };

    return await this.map.many(await this.repository.find(findOpts));
  }
}
