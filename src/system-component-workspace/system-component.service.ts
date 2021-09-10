import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateSystemComponentDTO } from '../dtos/system-component-update.dto';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private repository: SystemComponentWorkspaceRepository,
    private map: SystemComponentMap,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
    return this.map.many(results);
  }

  async getComponent(componentId: string): Promise<SystemComponentDTO> {
    const result = await this.repository.findOne(componentId);

    if (!result) {
      throw new NotFoundException('System Component not found');
    }

    return this.map.one(result);
  }

  async updateComponent(
    componentId: string,
    payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    const systemComponent = await this.getComponent(componentId);

    systemComponent.beginDate = payload.beginDate;
    systemComponent.beginHour = payload.beginHour;
    systemComponent.endDate = payload.endDate;
    systemComponent.endHour = payload.endHour;
    // TODO: userId
    systemComponent.userId = 'testuser';
    systemComponent.updateDate = new Date(Date.now());

    const result = await this.repository.save(systemComponent);

    return this.map.one(result);
  }
}
