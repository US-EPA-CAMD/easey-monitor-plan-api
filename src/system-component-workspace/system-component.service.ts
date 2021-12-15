import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateSystemComponentDTO } from '../dtos/system-component-update.dto';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { UpdateComponentDTO } from '../dtos/component-update.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentWorkspaceRepository } from './system-component.repository';
import { SystemComponent } from '../entities/system-component.entity';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private repository: SystemComponentWorkspaceRepository,
    private componentService: ComponentWorkspaceService,
    private map: SystemComponentMap,
    private Logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
    return this.map.many(results);
  }

  async getComponent(
    sysId: string,
    componentId: string,
  ): Promise<SystemComponentDTO> {
    const result = await this.repository.getComponent(sysId, componentId);

    if (!result) {
      this.Logger.error(
        NotFoundException,
        'System component was not found',
        true,
        {
          sysId: sysId,
          componentId: componentId,
        },
      );
    }

    return this.map.one(result);
  }

  async updateComponent(
    locationId: string,
    sysId: string,
    componentId: string,
    payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    const systemComponent = await this.getComponent(sysId, componentId);

    systemComponent.beginDate = payload.beginDate;
    systemComponent.beginHour = payload.beginHour;
    systemComponent.endDate = payload.endDate;
    systemComponent.endHour = payload.endHour;
    // TODO: userId
    systemComponent.userId = 'testuser';
    systemComponent.updateDate = new Date(Date.now());

    await this.repository.save(systemComponent);
    await this.mpService.resetToNeedsEvaluation('locId', 'userId');
    return this.getComponent(sysId, componentId);
  }

  async createSystemComponent(
    locationId: string,
    monitoringSystemRecordId: string,
    payload: UpdateSystemComponentDTO,
  ): Promise<SystemComponentDTO> {
    let component = await this.componentService.getComponentByIdentifier(
      locationId,
      payload.componentId,
    );

    let systemComponent: SystemComponent;

    if (!component) {
      const componentPayload: UpdateComponentDTO = {
        componentId: payload.componentId,
        componentTypeCode: payload.componentTypeCode,
        sampleAcquisitionMethodCode: payload.sampleAcquisitionMethodCode,
        basisCode: payload.basisCode,
        manufacturer: payload.manufacturer,
        modelVersion: payload.modelVersion,
        serialNumber: payload.serialNumber,
        hgConverterIndicator: payload.hgConverterIndicator,
      };

      component = await this.componentService.createComponent(
        locationId,
        componentPayload,
      );
    }

    systemComponent = this.repository.create({
      id: uuid(),
      monitoringSystemRecordId,
      componentRecordId: component.id,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      // TODO
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(systemComponent);
    await this.mpService.resetToNeedsEvaluation('locId', 'userId');
    return this.getComponent(monitoringSystemRecordId, component.id);
  }
}
