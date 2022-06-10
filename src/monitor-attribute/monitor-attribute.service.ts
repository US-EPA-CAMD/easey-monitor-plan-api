import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorAttributeRepository } from './monitor-attribute.repository';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';

@Injectable()
export class MonitorAttributeService {
  constructor(
    @InjectRepository(MonitorAttributeRepository)
    private repository: MonitorAttributeRepository,
    private map: MonitorAttributeMap,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
