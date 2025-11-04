import { Injectable } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentRepository } from './component.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class ComponentService {
  constructor(
    private readonly map: ComponentMap,
    private readonly dataSource: DataSource,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {;
    const results = await useSlaveRepository(this.dataSource, ComponentRepository, async (repository) => repository.find({
      where: {
        locationId,
      },
      order: {
        componentId: 'ASC',
      },
    }));
    return this.map.many(results);
  }
}
