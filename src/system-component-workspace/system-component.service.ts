import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
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
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';

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
    private readonly compRepository: ComponentWorkspaceRepository,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    const results = await this.repository.getComponents(locationId, monSysId);
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
      this.logger.error(
        NotFoundException,
        'System component was not found',
        true,
        {
          sysId: sysId,
          systemComponentRecordId: sysComponentRecordId,
        },
      );
    }

    return result;
  }

  async getComponenByBeginOrEndDate(
    sysId: string,
    componentId: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<SystemComponent> {
    return await this.repository.getComponenByBeginOrEndDate(
      sysId,
      componentId,
      beginDate,
      beginHour,
    );
  }

  async updateSystemComponent(
    locationId: string,
    sysId: string,
    sysComponentRecordId: string,
    payload: SystemComponentBaseDTO,
    userId: string,
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
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(systemComponent);
  }

  async createSystemComponent(
    locationId: string,
    monitoringSystemRecordId: string,
    payload: SystemComponentBaseDTO,
    userId: string,
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
    await this.mpService.resetToNeedsEvaluation(locationId, userId);

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
            const systemComponentRecord = await this.getComponenByBeginOrEndDate(
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
                ),
              );
            } else {
              innerPromises.push(
                await this.createSystemComponent(
                  locationId,
                  sysId,
                  component,
                  userId,
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
