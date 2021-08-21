import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentRepository } from './component.repository';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentRepository)
    private repository: ComponentRepository,
    private map: ComponentMap,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        componentIdentifier: 'ASC',
      },
    });
    return this.map.many(results);
  }
}
