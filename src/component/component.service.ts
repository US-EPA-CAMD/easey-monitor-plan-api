import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';

import { ComponentDTO, UpdateComponentBaseDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentRepository } from './component.repository';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentRepository)
    private readonly repository: ComponentRepository,
    private readonly map: ComponentMap,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        componentId: 'ASC',
      },
    });
    return this.map.many(results);
  }
}
