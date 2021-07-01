import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { UnitOpStatus } from '../entities/unit-op-status.entity';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';

@Injectable()
export class UnitOpStatusMap extends BaseMap<UnitOpStatus, UnitOpStatusDTO> {
  public async one(entity: UnitOpStatus): Promise<UnitOpStatusDTO> {
    return {
      id: entity.id,
      unitId: entity.unitId,
      opStatusCode: entity.opStatusCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
    };
  }
}
