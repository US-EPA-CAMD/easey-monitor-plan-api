import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { UpdateSystemComponentDTO } from '../dtos/system-component-update.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceRepository } from './system-component.repository';
import { ComponentRepository } from '../component/component.repository';
import { SystemComponent } from '../entities/system-component.entity';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private repository: SystemComponentWorkspaceRepository,
    @InjectRepository(ComponentRepository)
    private componentRepository: ComponentRepository,
    private map: SystemComponentMap,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
    return this.map.many(results);
  }

  async createSystemComponents(
    locationId: string,
    monitoringSystemRecordId: string,
    payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    const component = await this.componentRepository.findOne({
      componentId: payload.componentId,
      locationId,
    });

    let systemComponent: SystemComponent;

    if (component) {
      systemComponent = await this.repository.create({
        id: uuid(),
        monitoringSystemRecordId,
        componentRecordId: component.componentId,
        beginDate: payload.beginDate,
        beginHour: payload.beginHour,
        endDate: payload.endDate,
        endHour: payload.endHour,
        // TODO
        userId: 'testuser',
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });
    } else {
    }

    const result = await this.repository.save(systemComponent);

    return this.map.one(result);
  }
}
