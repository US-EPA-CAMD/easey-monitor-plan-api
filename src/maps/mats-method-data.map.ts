import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MatsMethodData } from '../entities/mats-method-data.entity';
import { MatsMethodDataDTO } from '../dtos/mats-method-data.dto';

@Injectable()
export class MatsMethodMap extends BaseMap<MatsMethodData, MatsMethodDataDTO> {
  public async one(entity: MatsMethodData): Promise<MatsMethodDataDTO> {
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
