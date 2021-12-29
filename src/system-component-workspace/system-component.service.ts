import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { ComponentWorkspaceRepository } from 'src/component-workspace/component.repository';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private repository: SystemComponentWorkspaceRepository,
    private componentService: ComponentWorkspaceService,
    private map: SystemComponentMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
    private compRepository: ComponentWorkspaceRepository,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    let result;
    try {
      result = await this.repository.getComponents(locationId, monSysId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getComponent(
    sysId: string,
    componentId: string,
  ): Promise<SystemComponentDTO> {
    let result;
    try {
      result = await this.repository.getComponent(sysId, componentId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(
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
    userId: string,
  ): Promise<SystemComponentDTO> {
    // Saving System Component fields

    try {
      const systemComponent = await this.getComponent(sysId, componentId);

      systemComponent.modelVersion = payload.modelVersion;
      systemComponent.sampleAcquisitionMethodCode =
        payload.sampleAcquisitionMethodCode;
      systemComponent.componentTypeCode = payload.componentTypeCode;
      systemComponent.basisCode = payload.basisCode;
      systemComponent.manufacturer = payload.manufacturer;
      systemComponent.modelVersion = payload.modelVersion;
      systemComponent.serialNumber = payload.serialNumber;
      systemComponent.hgConverterIndicator = payload.hgConverterIndicator;

      systemComponent.beginDate = payload.beginDate;
      systemComponent.beginHour = payload.beginHour;
      systemComponent.endDate = payload.endDate;
      systemComponent.endHour = payload.endHour;
      systemComponent.userId = userId;
      systemComponent.updateDate = new Date(Date.now());

      // Saving Component fields
      const component = await this.compRepository.getComponent(
        systemComponent.componentRecordId,
      );

      component.componentId = payload.componentId;
      component.sampleAcquisitionMethodCode =
        payload.sampleAcquisitionMethodCode;
      component.componentTypeCode = payload.componentTypeCode;
      component.basisCode = payload.basisCode;
      component.manufacturer = payload.manufacturer;
      component.modelVersion = payload.modelVersion;
      component.serialNumber = payload.serialNumber;
      component.hgConverterIndicator = payload.hgConverterIndicator;
      component.userId = userId;
      component.updateDate = new Date(Date.now());

      await this.repository.save(systemComponent);
      await this.compRepository.save(component);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.getComponent(sysId, componentId);
  }

  async createSystemComponent(
    locationId: string,
    monitoringSystemRecordId: string,
    payload: UpdateSystemComponentDTO,
    userId: string,
  ): Promise<SystemComponentDTO> {
    let component;
    try {
      component = await this.componentService.getComponentByIdentifier(
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
          userId,
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
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      await this.repository.save(systemComponent);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getComponent(monitoringSystemRecordId, component.id);
  }
}
