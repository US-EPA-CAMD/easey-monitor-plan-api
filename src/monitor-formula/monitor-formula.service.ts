import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';

@Injectable()
export class MonitorFormulaService {
  constructor(
    @InjectRepository(MonitorFormulaRepository)
    private repository: MonitorFormulaRepository,
    private map: MonitorFormulaMap,
  ) {}

  async getFormulas(monLocId: string): Promise<MonitorFormulaDTO[]> {
    const results = await this.repository.find({ monLocId: monLocId });
    return this.map.many(results);
  }
}
