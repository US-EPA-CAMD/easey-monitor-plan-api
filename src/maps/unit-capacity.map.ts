import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitCapacity } from '../entities/unit-capacity.entity';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';

@Injectable()
export class UnitCapacityMap extends BaseMap<UnitCapacity, UnitCapacityDTO> {
  public async one(entity: UnitCapacity): Promise<UnitCapacityDTO> {
    console.log(entity.unit);

    return {
      id: entity.id,
      unitRecordId: entity.unitId,
      commercialOperationDate: entity.unit.commercialOperationDate,
      operationDate: entity.unit.operationDate,
      boilerTurbineType: entity.unit.unitBoilerType.unitTypeCode,
      boilerTurbineBeginDate: entity.unit.unitBoilerType.beginDate,
      boilerTurbineEndDate: entity.unit.unitBoilerType.endDate,
      maximumHourlyHeatInputCapacity: entity.maximumHourlyHeatInputCapacity,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
