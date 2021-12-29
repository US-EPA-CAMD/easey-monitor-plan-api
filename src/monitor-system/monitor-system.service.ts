import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorSystemRepository } from './monitor-system.repository';

@Injectable()
export class MonitorSystemService {
  constructor(
    @InjectRepository(MonitorSystemRepository)
    private repository: MonitorSystemRepository,
    private map: MonitorSystemMap,
    private logger: Logger,
  ) {}

  async getSystems(locationId: string): Promise<MonitorSystemDTO[]> {
    let result;
    try {
      result = await this.repository.find({
        where: {
          locationId,
        },
        order: {
          monitoringSystemId: 'ASC',
        },
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
