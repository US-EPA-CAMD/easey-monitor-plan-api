import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import {Component} from '../entities/component.entity';
import { ComponentDTO } from '../dtos/component.dto';

@Injectable()
export class ComponentMap extends BaseMap<Component, ComponentDTO> {
  public async one(entity: Component): Promise<ComponentDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      componentTypeCode : entity.componentTypeCode,
      basisCode: entity.basisCode,
      modelVersion: entity.modelVersion,
      manufacturer: entity.manufacturer,
      serialNumber : entity.serialNumber,
      hgConverterInd: entity.hgConverterInd,
      acquisitionMethodCode: entity.acquisitionMethodCode,
      beginDate: null,
      beginHour: null,
      endDate: null,
      endHour: null,
    };
  }
}
