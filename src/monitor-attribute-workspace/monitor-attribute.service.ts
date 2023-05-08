import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorAttributeMap } from '../maps/monitor-attribute.map';
import { v4 as uuid } from 'uuid';
import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {currentDateTime} from "@us-epa-camd/easey-common/utilities/functions";

@Injectable()
export class MonitorAttributeWorkspaceService {
  constructor(
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private readonly repository: MonitorAttributeWorkspaceRepository,
    private readonly map: MonitorAttributeMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
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
      throw new LoggingException(
        'Monitor Location Attribute not found',
        HttpStatus.NOT_FOUND,
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
    payload: MonitorAttributeBaseDTO,
    userId: string,
    isImport = false,
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
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(attribute);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getAttribute(locationId, result.id);
  }

  async updateAttribute(
    locationId: string,
    id: string,
    payload: MonitorAttributeBaseDTO,
    userId: string,
    isImport = false,
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
    attribute.userId = userId;
    attribute.updateDate = currentDateTime();

    await this.repository.save(attribute);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getAttribute(locationId, id);
  }

  async importAttributes(
    locationId: string,
    attributes: MonitorAttributeBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const attribute of attributes) {
        promises.push(
          new Promise(async innerResolve => {
            const attributeRecord = await this.repository.getAttributeByLocIdAndDate(
              locationId,
              attribute.beginDate,
            );

            if (attributeRecord !== undefined) {
              await this.updateAttribute(
                locationId,
                attributeRecord.id,
                attribute,
                userId,
                true,
              );
            } else {
              await this.createAttribute(locationId, attribute, userId, true);
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
