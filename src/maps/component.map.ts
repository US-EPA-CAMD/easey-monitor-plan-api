import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { Component } from '../entities/component.entity';
import { ComponentDTO } from '../dtos/component.dto';
import { AnalyzerRangeMap } from './analyzer-range.map';

@Injectable()
export class ComponentMap extends BaseMap<Component, ComponentDTO> {
  constructor(private rangeMap: AnalyzerRangeMap) {
    super();
  }

  public async one(entity: Component): Promise<ComponentDTO> {
    console.log(entity.analyzerRanges);
    const analyzerRanges = entity.analyzerRanges
      ? await this.rangeMap.many(entity.analyzerRanges)
      : null;

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
      analyzerRanges: analyzerRanges,
    };
  }
}
