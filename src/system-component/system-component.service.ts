import { Injectable } from '@nestjs/common';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentRepository } from './system-component.repository';

@Injectable()
export class SystemComponentService {
  constructor(
    private repository: SystemComponentRepository,
    private map: SystemComponentMap,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
    return this.map.many(results);
  }
}
