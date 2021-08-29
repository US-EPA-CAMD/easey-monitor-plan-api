import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';

@Injectable()
export class MonitorAttributeWorkspaceService {
  constructor(
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private repository: MonitorAttributeWorkspaceRepository,
    private map: MonitorAttributeMap,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
