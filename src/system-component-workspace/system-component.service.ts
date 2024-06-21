import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { ComponentWorkspaceService } from '../component-workspace/component.service';
import {
  SystemComponentBaseDTO,
  SystemComponentDTO,
} from '../dtos/system-component.dto';
import { SystemComponent } from '../entities/workspace/system-component.entity';
import { SystemComponentMap } from '../maps/system-component.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { SystemComponentWorkspaceRepository } from './system-component.repository';

@Injectable()
export class SystemComponentWorkspaceService {
  constructor(
    private readonly repository: SystemComponentWorkspaceRepository,
    @Inject(forwardRef(() => ComponentWorkspaceService))
    private readonly componentService: ComponentWorkspaceService,
    private readonly map: SystemComponentMap,
    private readonly componentWorkspaceRepository: ComponentWorkspaceRepository,
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
    trx?: EntityManager,
  ): Promise<SystemComponent> {
    const result = await withTransaction(
      this.repository,
      trx,
    ).getSystemComponent(sysId, sysComponentRecordId);

    if (!result) {
      throw new EaseyException(
        new Error('System component was not found'),
        HttpStatus.NOT_FOUND,
        {
          sysId: sysId,
          systemComponentRecordId: sysComponentRecordId,
        },
      );
    }

    return result;
  }

  async updateSystemComponent({
    locationId,
    sysId,
    sysComponentRecordId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    sysId: string;
    sysComponentRecordId: string;
    payload: SystemComponentBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<SystemComponentDTO> {
    // Saving System Component fields

    const systemComponent = await this.getSystemComponent(
      sysId,
      sysComponentRecordId,
      trx,
    );

    systemComponent.beginDate = payload.beginDate;
    systemComponent.beginHour = payload.beginHour;
    systemComponent.endDate = payload.endDate;
    systemComponent.endHour = payload.endHour;
    systemComponent.userId = userId;
    systemComponent.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(systemComponent);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(systemComponent);
  }

  async createSystemComponent({
    locationId,
    monitoringSystemRecordId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    monitoringSystemRecordId: string;
    payload: SystemComponentBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<SystemComponentDTO> {
    let component = await this.componentService.getComponentByIdentifier(
      locationId,
      payload.componentId,
      trx,
    );

    if (!component) {
      throw new EaseyException(
        new Error('Component was not found'),
        HttpStatus.NOT_FOUND,
        {
          componentId: payload.componentId,
        },
      );
    }

    const repository = withTransaction(this.repository, trx);

    const systemComponent = repository.create({
      id: uuid(),
      monitoringSystemRecordId: monitoringSystemRecordId,
      componentRecordId: component.id,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(systemComponent);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    const createdSysComp = await this.getSystemComponent(
      monitoringSystemRecordId,
      systemComponent.id,
      trx,
    );
    return this.map.one(createdSysComp);
  }

  async importSystemComponent(
    locationId: string,
    sysId: string,
    systemComponents: SystemComponentBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const component of systemComponents) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const innerPromises = [];
                const systemComponentRecord = await withTransaction(
                  this.repository,
                  trx,
                ).getSystemComponentByBeginOrEndDate(
                  sysId,
                  component.componentId,
                  component.beginDate,
                  component.beginHour,
                );

                if (systemComponentRecord) {
                  innerPromises.push(
                    await this.updateSystemComponent({
                      locationId,
                      sysId,
                      sysComponentRecordId: systemComponentRecord.id,
                      payload: component,
                      userId,
                      isImport: true,
                      trx,
                    }),
                  );
                } else {
                  innerPromises.push(
                    await this.createSystemComponent({
                      locationId,
                      monitoringSystemRecordId: sysId,
                      payload: component,
                      userId,
                      isImport: true,
                      trx,
                    }),
                  );
                }

                await Promise.all(innerPromises);
                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
