import { Injectable } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';

@Injectable()
export class MonitorFormulaService {
  constructor(
    private repository: MonitorFormulaRepository,
    private map: MonitorFormulaMap,
  ) {}

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
