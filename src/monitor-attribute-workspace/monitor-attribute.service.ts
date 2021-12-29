import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorAttributeDTO } from '../dtos/monitor-attribute-update.dto';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorAttributeWorkspaceService {
  constructor(
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private readonly repository: MonitorAttributeWorkspaceRepository,
    private readonly map: MonitorAttributeMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAttributes(locationId: string): Promise<MonitorAttributeDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getAttribute(
    locationId: string,
    id: string,
  ): Promise<MonitorAttributeDTO> {
    let result;
    try {
      result = await this.repository.getAttribute(locationId, id);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(
        NotFoundException,
        'Monitor Location Attribute not found',
        true,
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
    let result;
    try {
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
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(attribute);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getAttribute(locationId, result.id);
  }

  async updateAttribute(
    locationId: string,
    id: string,
    payload: UpdateMonitorAttributeDTO,
    userId: string,
  ): Promise<MonitorAttributeDTO> {
    try {
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
      attribute.userId = userId;
      attribute.updateDate = new Date(Date.now());

      await this.repository.save(attribute);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getAttribute(locationId, id);
  }
}
