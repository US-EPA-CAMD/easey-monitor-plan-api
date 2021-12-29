import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaRepository } from './monitor-formula.repository';

@Injectable()
export class MonitorFormulaService {
  constructor(
    @InjectRepository(MonitorFormulaRepository)
    private repository: MonitorFormulaRepository,
    private map: MonitorFormulaMap,
    private readonly logger: Logger,
  ) {}

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
