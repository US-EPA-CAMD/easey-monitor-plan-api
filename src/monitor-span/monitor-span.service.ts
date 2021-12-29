import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorSpanRepository } from './monitor-span.repository';

@Injectable()
export class MonitorSpanService {
  constructor(
    @InjectRepository(MonitorSpanRepository)
    private repository: MonitorSpanRepository,
    private map: MonitorSpanMap,
    private readonly logger: Logger,
  ) {}

  async getSpans(locationId: string): Promise<MonitorSpanDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
