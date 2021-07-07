import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentRepository } from './system-component.repository';

@Injectable()
export class SystemComponentService {
  constructor(
    @InjectRepository(SystemComponentRepository)
    private repository: SystemComponentRepository,
    private map: SystemComponentMap,
  ) {}

  async getComponents(
    monLocId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(monLocId, monSysId);
    return this.map.many(results);
  }
}
