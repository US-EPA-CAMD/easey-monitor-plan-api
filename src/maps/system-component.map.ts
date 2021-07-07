import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { SystemComponent } from '../entities/system-component.entity';
import { SystemComponentDTO } from '../dtos/system-component.dto';

@Injectable()
export class SystemComponentMap extends BaseMap<
  SystemComponent,
  SystemComponentDTO
> {
  public async one(entity: SystemComponent): Promise<SystemComponentDTO> {
    return {
      id: entity.id,
      componentId: entity.componentId,
      monSysId: entity.monSysId,
      monLocId: entity.component.monLocId,
      componentIdentifier: entity.component.componentIdentifier,
      componentTypeCode: entity.component.componentTypeCode,
      basisCode: entity.component.basisCode,
      modelVersion: entity.component.modelVersion,
      manufacturer: entity.component.manufacturer,
      serialNumber: entity.component.serialNumber,
      hgConverterInd: entity.component.hgConverterInd,
      acquisitionMethodCode: entity.component.acquisitionMethodCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      active: entity.endDate === null,
    };
  }
}
