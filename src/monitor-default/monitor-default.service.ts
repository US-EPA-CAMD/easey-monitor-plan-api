import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorDefaultRepository } from './monitor-default.repository';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorDefaultService {
  constructor(
    @InjectRepository(MonitorDefaultRepository)
    private repository: MonitorDefaultRepository,
    private map: MonitorDefaultMap,
    private readonly logger: Logger,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
