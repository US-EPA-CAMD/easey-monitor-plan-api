import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorSpanRepository } from './monitor-span.repository';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanDTO } from '../dtos/monitor-span.dto';

@Injectable()
export class MonitorSpanService {
  constructor(
    @InjectRepository(MonitorSpanRepository)
    private repository: MonitorSpanRepository,
    private map: MonitorSpanMap,
  ) {}

  async getMonitorSpans(monLocId: string): Promise<MonitorSpanDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'mpcValue',
        'mecValue',
        'maxLowRange',
        'spanValue',
        'fullScaleRange',
        'beginDate',
        'beginHour',
        'endDate',
        'endHour',
        'defaultHighRange',
        'flowSpanValue',
        'flowFullScaleRange',
        'componentTypeCd',
        'spanScaleCd',
        'spanMethodCd',
        'userid',
        'updateDate',
        'spanUomCd',
      ],
      where: { monLocId: monLocId },
    };

    return await this.map.many(await this.repository.find(findOpts));
  }
}
