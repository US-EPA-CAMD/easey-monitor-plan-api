import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { withTransaction } from '../utils';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';

@Injectable()
export class MonitorAttributeWorkspaceService {
  constructor(
    private readonly repository: MonitorAttributeWorkspaceRepository,
    private readonly map: MonitorAttributeMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttributeDTO> {
    const result = await this.repository.getAttribute(locationId, id);

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Location Attribute not found'),
        HttpStatus.NOT_FOUND,
        {
          locationId,
          id,
        },
      );
    }

    return this.map.one(result);
  }

  async createAttribute({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorAttributeBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorAttributeDTO> {
    const repository = withTransaction(this.repository, trx);

    const attribute = repository.create({
      id: uuid(),
      locationId,
      ductIndicator: payload.ductIndicator,
      bypassIndicator: payload.bypassIndicator,
      groundElevation: payload.groundElevation,
      stackHeight: payload.stackHeight,
      materialCode: payload.materialCode,
      shapeCode: payload.shapeCode,
      crossAreaFlow: payload.crossAreaFlow,
      crossAreaStackExit: payload.crossAreaStackExit,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(attribute);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.getAttribute(locationId, result.id);
  }

  async updateAttribute({
    locationId,
    id,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    id: string;
    payload: MonitorAttributeBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorAttributeDTO> {
    const repository = withTransaction(this.repository, trx);

    const attribute = await repository.getAttribute(locationId, id);

    if (!attribute) {
      throw new EaseyException(
        new Error('Monitor Location Attribute not found'),
        HttpStatus.NOT_FOUND,
        {
          locationId,
          id,
        },
      );
    }

    attribute.ductIndicator = payload.ductIndicator;
    attribute.bypassIndicator = payload.bypassIndicator;
    attribute.groundElevation = payload.groundElevation;
    attribute.stackHeight = payload.stackHeight;
    attribute.materialCode = payload.materialCode;
    attribute.shapeCode = payload.shapeCode;
    attribute.crossAreaFlow = payload.crossAreaFlow;
    attribute.crossAreaStackExit = payload.crossAreaStackExit;
    attribute.beginDate = payload.beginDate;
    attribute.endDate = payload.endDate;
    attribute.userId = userId;
    attribute.updateDate = currentDateTime();

    await repository.save(attribute);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(attribute);
  }

  async importAttributes(
    locationId: string,
    attributes: MonitorAttributeBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ) {
    await Promise.all(
      attributes.map(async attribute => {
        const attributeRecord = await withTransaction(
          this.repository,
          trx,
        ).getAttributeByLocIdAndDate(locationId, attribute.beginDate);

        if (attributeRecord) {
          await this.updateAttribute({
            locationId,
            id: attributeRecord.id,
            payload: attribute,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createAttribute({
            locationId,
            payload: attribute,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
    return true;
  }
}
