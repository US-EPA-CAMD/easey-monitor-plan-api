import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorAttributeDTO } from '../dtos/monitor-attribute-update.dto';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';

@Injectable()
export class MonitorAttributeWorkspaceService {
  constructor(
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private readonly repository: MonitorAttributeWorkspaceRepository,
    private readonly map: MonitorAttributeMap,
    private readonly logger: Logger,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttributeDTO> {
    const result = await this.repository.getAttribute(locationId, id);

    if (!result) {
      this.logger.error(
        NotFoundException,
        'Monitor Location Attribute not found',
        {
          locationId,
          id,
        },
      );
    }

    return this.map.one(result);
  }

  async createAttribute(
    locationId: string,
    payload: UpdateMonitorAttributeDTO,
    userId: string,
  ): Promise<MonitorAttributeDTO> {
    const attribute = this.repository.create({
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
      userId: userId.slice(0, 8),
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(attribute);

    return this.getAttribute(locationId, result.id);
  }

  async updateAttribute(
    locationId: string,
    id: string,
    payload: UpdateMonitorAttributeDTO,
    userId: string,
  ): Promise<MonitorAttributeDTO> {
    const attribute = await this.getAttribute(locationId, id);

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
    attribute.userId = userId.slice(0, 8);
    attribute.updateDate = new Date(Date.now());

    await this.repository.save(attribute);

    return this.getAttribute(locationId, id);
  }
}
