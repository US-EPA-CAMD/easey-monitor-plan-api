import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MatsMethod } from '../entities/mats-method.entity';
import { MatsMethodDTO } from '../dtos/mats-method.dto';

@Injectable()
export class MatsMethodMap extends BaseMap<MatsMethod, MatsMethodDTO> {
  public async one(entity: MatsMethod): Promise<MatsMethodDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      matsMethodParameterCode: entity.matsMethodParameterCode,
      matsMethodCode: entity.matsMethodCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      active: entity.endDate === null,
    };
  }
}
