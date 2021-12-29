import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadRepository } from './monitor-load.repository';

@Injectable()
export class MonitorLoadService {
  constructor(
    @InjectRepository(MonitorLoadRepository)
    private repository: MonitorLoadRepository,
    private map: MonitorLoadMap,
    private readonly logger: Logger,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
