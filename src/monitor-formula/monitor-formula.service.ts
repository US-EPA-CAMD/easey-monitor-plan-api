import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorFormulaRepository } from './monitor-formula.repository';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';

@Injectable()
export class MonitorFormulaService {
  constructor(
    @InjectRepository(MonitorFormulaRepository)
    private repository: MonitorFormulaRepository,
    private map: MonitorFormulaMap,
  ) {}

  async getMonitorFormulas(monLocId: string): Promise<MonitorFormulaDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'monLocId',
        'parameterCd',
        'equationCd',
        'formulaIdentifier',
        'beginDate',
        'beginHour',
        'endDate',
        'endHour',
        'formulaEquation',
        'userId',
        'addDate',
        'updateDate',
      ],
      where: { monLocId: monLocId },
    };

    return await this.map.many(await this.repository.find(findOpts));
  }
}
