import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorAttributeService {
  constructor(
    @InjectRepository(MonitorAttributeRepository)
    private repository: MonitorAttributeRepository,
    private map: MonitorAttributeMap,
    private readonly logger: Logger,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
