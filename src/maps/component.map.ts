import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { Component } from '../entities/component.entity';
import { ComponentDTO } from '../dtos/component.dto';

@Injectable()
export class ComponentMap extends BaseMap<Component, ComponentDTO> {
  public async one(entity: Component): Promise<ComponentDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      componentId: entity.componentId,
      componentTypeCode: entity.componentTypeCode,
      sampleAcquisitionMethodCode: entity.sampleAcquisitionMethodCode,
      basisCode: entity.basisCode,
      manufacturer: entity.manufacturer,
      modelVersion: entity.modelVersion,
      serialNumber: entity.serialNumber,
      hgConverterIndicator: entity.hgConverterIndicator,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
