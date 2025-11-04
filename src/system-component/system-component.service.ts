import { Injectable } from '@nestjs/common';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentRepository } from './system-component.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class SystemComponentService {
  constructor(
    private map: SystemComponentMap,
    private readonly dataSource: DataSource,
    ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await useSlaveRepository(this.dataSource, SystemComponentRepository, async (repository) => repository.getComponents(locationId, monSysId));
    return this.map.many(results);
  }
}
