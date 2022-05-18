import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';
import {
  MonitorAttributeBaseDTO,
  MonitorAttributeDTO,
} from '../dtos/monitor-attribute.dto';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';

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

  async getAttributeByLocIdAndDate(
    locationId: string,
    attribute: MonitorAttributeBaseDTO,
  ) {
    const result = await this.repository.getAttributeByLocIdAndDate(
      locationId,
      attribute,
    );

    if (result) {
      return this.map.one(result);
    }
    return result;
  }

  async createAttribute(
    locationId: string,
    payload: MonitorAttributeBaseDTO,
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
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(attribute);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.getAttribute(locationId, result.id);
  }

  async updateAttribute(
    locationId: string,
    id: string,
    payload: MonitorAttributeBaseDTO,
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
    attribute.userId = userId;
    attribute.updateDate = new Date(Date.now());

    await this.repository.save(attribute);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
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
            const attributeRecord = await this.getAttributeByLocIdAndDate(
              locationId,
              attribute,
            );

            if (attributeRecord) {
              console.log('attributeRecord: ', attributeRecord.id);
              console.log('Updating Attributes');
              await this.updateAttribute(
                locationId,
                attributeRecord.id,
                attribute,
                userId,
              );
            } else {
              console.log('Creating Attributes');
              await this.createAttribute(locationId, attribute, userId);
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
