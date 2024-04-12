import { Injectable } from '@nestjs/common';

import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorAttributeRepository } from './monitor-attribute.repository';

@Injectable()
export class MonitorAttributeService {
  constructor(
    private repository: MonitorAttributeRepository,
    private map: MonitorAttributeMap,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
