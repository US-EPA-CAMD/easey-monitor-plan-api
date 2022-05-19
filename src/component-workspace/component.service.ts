import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { UpdateComponentBaseDTO, ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentWorkspaceRepository } from './component.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';
import { AnalyzerRangeWorkspaceService } from '../analyzer-range-workspace/analyzer-range.service';
import { Component } from 'src/entities/component.entity';

@Injectable()
export class ComponentWorkspaceService {
  constructor(
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly repository: ComponentWorkspaceRepository,
    private readonly map: ComponentMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => AnalyzerRangeWorkspaceService))
    private readonly analyzerRangeService: AnalyzerRangeWorkspaceService,
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
      const innerPromises = [];
      for (const component of location.components) {
        innerPromises.push(
          new Promise(async innerResolve => {
            let compRecord = await this.repository.getComponentByLocIdAndCompId(
              locationId,
              component.componentId,
            );

            if (compRecord) {
              await this.updateComponent(compRecord, component, userId);
            } else {
              await this.createComponent(locationId, component, userId);
              compRecord = await this.repository.getComponentByLocIdAndCompId(
                locationId,
                component.componentId,
              );
            }

            await this.analyzerRangeService.importAnalyzerRange(
              compRecord.id,
              locationId,
              component.analyzerRanges,
              userId,
            );

            innerResolve(true);
          }),
        );
      }
      await Promise.all(innerPromises);
      resolve(true);
    });
  }

  async updateComponent(
    DbRecord: Component,
    payload: UpdateComponentBaseDTO,
    userId: string,
  ): Promise<ComponentDTO> {
    DbRecord.modelVersion = payload.modelVersion;
    DbRecord.serialNumber = payload.serialNumber;
    DbRecord.hgConverterIndicator = payload.hgConverterIndicator;
    DbRecord.manufacturer = payload.manufacturer;
    DbRecord.componentTypeCode = payload.componentTypeCode;
    DbRecord.sampleAcquisitionMethodCode = payload.sampleAcquisitionMethodCode;
    DbRecord.basisCode = payload.basisCode;
    DbRecord.userId = userId;
    DbRecord.updateDate = new Date(Date.now());

    const result = await this.repository.save(DbRecord);
    return this.map.one(result);
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
