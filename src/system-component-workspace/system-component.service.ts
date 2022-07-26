import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from '../dtos/system-component.dto';
import { UpdateComponentBaseDTO } from '../dtos/component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponent } from '../entities/system-component.entity';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    @InjectRepository(SystemComponentWorkspaceRepository)
    private readonly repository: SystemComponentWorkspaceRepository,
    private readonly componentService: ComponentWorkspaceService,
    private readonly map: SystemComponentMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getSystemComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getSystemComponents(
      locationId,
      monSysId,
    );
    return this.map.many(results);
  }

  async getSystemComponent(
    sysId: string,
    sysComponentRecordId: string,
  ): Promise<SystemComponent> {
    const result = await this.repository.getSystemComponent(
      sysId,
      sysComponentRecordId,
    );

    if (!result) {
      throw new LoggingException(
        'System component was not found',
        HttpStatus.NOT_FOUND,
        {
          sysId: sysId,
          systemComponentRecordId: sysComponentRecordId,
        },
      );
    }

    return result;
  }

  async updateSystemComponent(
    locationId: string,
    sysId: string,
    sysComponentRecordId: string,
    payload: SystemComponentBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<SystemComponentDTO> {
    // Saving System Component fields
    const systemComponent = await this.getSystemComponent(
      sysId,
      sysComponentRecordId,
    );

    systemComponent.beginDate = payload.beginDate;
    systemComponent.beginHour = payload.beginHour;
    systemComponent.endDate = payload.endDate;
    systemComponent.endHour = payload.endHour;
    systemComponent.userId = userId;
    systemComponent.updateDate = new Date(Date.now());

    await this.repository.save(systemComponent);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(systemComponent);
  }

  async createSystemComponent(
    locationId: string,
    monitoringSystemRecordId: string,
    payload: SystemComponentBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<SystemComponentDTO> {
    let component = await this.componentService.getComponentByIdentifier(
      locationId,
      payload.componentId,
    );

    if (!component) {
      const componentPayload: UpdateComponentBaseDTO = {
        componentId: payload.componentId,
        componentTypeCode: payload.componentTypeCode,
        sampleAcquisitionMethodCode: payload.sampleAcquisitionMethodCode,
        basisCode: payload.basisCode,
        manufacturer: payload.manufacturer,
        modelVersion: payload.modelVersion,
        serialNumber: payload.serialNumber,
        hgConverterIndicator: payload.hgConverterIndicator,
        analyzerRanges: [],
      };

      component = await this.componentService.createComponent(
        locationId,
        componentPayload,
        userId,
      );
    }

    const systemComponent = this.repository.create({
      id: uuid(),
      monitoringSystemRecordId: monitoringSystemRecordId,
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

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    const createdSysComp = await this.getSystemComponent(
      monitoringSystemRecordId,
      systemComponent.id,
    );
    return this.map.one(createdSysComp);
  }

  async importComponent(
    locationId: string,
    sysId: string,
    systemComponents: SystemComponentBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const component of systemComponents) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];
            const systemComponentRecord = await this.repository.getSystemComponentByBeginOrEndDate(
              sysId,
              component.componentId,
              component.beginDate,
              component.beginHour,
            );

            if (systemComponentRecord) {
              innerPromises.push(
                await this.updateSystemComponent(
                  locationId,
                  sysId,
                  systemComponentRecord.id,
                  component,
                  userId,
                  true,
                ),
              );
            } else {
              innerPromises.push(
                await this.createSystemComponent(
                  locationId,
                  sysId,
                  component,
                  userId,
                  true,
                ),
              );
            }

            await Promise.all(innerPromises);
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
