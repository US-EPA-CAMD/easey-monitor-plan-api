import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateComponentDTO } from '../dtos/component-update.dto';
import { ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentWorkspaceRepository } from './component.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class ComponentWorkspaceService {
  constructor(
    @InjectRepository(ComponentWorkspaceRepository)
    private repository: ComponentWorkspaceRepository,
    private map: ComponentMap,
    private readonly logger: Logger,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    this.logger.info('Getting components');

    let results;
    try {
      results = await this.repository.find({
        where: {
          locationId,
        },
        order: {
          componentId: 'ASC',
        },
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got components');

    return this.map.many(results);
  }

  async getComponentByIdentifier(locationId: string, componentId: string) {
    this.logger.info('Getting component by identifier');

    let result;
    try {
      result = await this.repository.findOne({
        where: {
          locationId,
          componentId,
        },
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got component by identifier');

    if (result) {
      return this.map.one(result);
    }

    return null;
  }

  async createComponent(
    locationId: string,
    payload: UpdateComponentDTO,
    userId: string,
  ): Promise<ComponentDTO> {
    let result;
    try {
      const component = this.repository.create({
        id: uuid(),
        locationId,
        componentId: payload.componentId,
        modelVersion: payload.modelVersion,
        serialNumber: payload.serialNumber,
        manufacturer: payload.manufacturer,
        componentTypeCode: payload.componentTypeCode,
        sampleAcquisitionMethodCode: payload.sampleAcquisitionMethodCode,
        basisCode: payload.basisCode,
        hgConverterIndicator: payload.hgConverterIndicator,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      this.logger.info('Creating component', {
        locationId: locationId,
        payload: payload,
      });

      result = await this.repository.save(component);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.one(result);
  }
}
