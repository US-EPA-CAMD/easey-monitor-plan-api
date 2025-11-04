import { Injectable } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorFormulaService {
  constructor(
    private map: MonitorFormulaMap,
    private readonly dataSource: DataSource,
  ) {}

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorFormulaRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
