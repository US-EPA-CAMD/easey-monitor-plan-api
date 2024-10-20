import { Injectable } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentRepository } from './component.repository';

@Injectable()
export class ComponentService {
  constructor(
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
