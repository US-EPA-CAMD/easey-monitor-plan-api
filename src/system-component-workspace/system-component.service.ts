import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorSystemService } from '../monitor-system/monitor-system.service';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private repository: SystemComponentWorkspaceRepository,
    private sysService: MonitorSystemService,
    private map: SystemComponentMap,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
    return this.map.many(results);
  }

  async createSystemComponents() {}
}
