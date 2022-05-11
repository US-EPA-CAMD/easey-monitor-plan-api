import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { UpdateComponentBaseDTO, ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentWorkspaceRepository } from './component.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { AnalyzerRangeWorkspaceService } from '../analyzer-range-workspace/analyzer-range.service';

@Injectable()
export class ComponentWorkspaceService {
  constructor(
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly repository: ComponentWorkspaceRepository,
    private readonly map: ComponentMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => AnalyzerRangeWorkspaceService))
    private readonly analyzerRangService: AnalyzerRangeWorkspaceService,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    const results = await this.repository.find({
      where: {
        locationId,
      },
      order: {
        componentId: 'ASC',
      },
    });
    return this.map.many(results);
  }

  async getComponentByIdentifier(locationId: string, componentId: string) {
    const result = await this.repository.findOne({
      where: {
        locationId,
        componentId,
      },
    });

    if (result) {
      return this.map.one(result);
    }

    return null;
  }

  async importComponent(
    location: UpdateMonitorLocationDTO,
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      for (const component of location.components) {
        await this.createComponent(locationId, component, userId);

        await this.analyzerRangService.importAnalyzerRange(
          component.componentId,
          locationId,
          component.analyzerRanges,
          userId,
        );
      }
      resolve(true);
    });
  }

  async createComponent(
    locationId: string,
    payload: UpdateComponentBaseDTO,
    userId: string,
  ): Promise<ComponentDTO> {
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

    const result = await this.repository.save(component);

    return this.map.one(result);
  }
}
