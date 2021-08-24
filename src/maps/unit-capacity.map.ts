import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { UnitCapacity } from '../entities/unit-capacity.entity';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';

@Injectable()
export class UnitCapacityMap extends BaseMap<UnitCapacity, UnitCapacityDTO> {
  public async one(entity: UnitCapacity): Promise<UnitCapacityDTO> {
    return {
      id: entity.id,
      unitId: entity.unitId,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      maximumHourlyHeatInputCapacity: entity.maximumHourlyHeatInputCapacity,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
