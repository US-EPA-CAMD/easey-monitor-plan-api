import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitCapacity } from '../entities/unit-capacity.entity';
import { UnitCapacity as WorkspaceUnitCapacity } from '../entities/workspace/unit-capacity.entity';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';

@Injectable()
export class UnitCapacityMap extends BaseMap<
  UnitCapacity | WorkspaceUnitCapacity,
  UnitCapacityDTO
> {
  public async one(
    entity: UnitCapacity | WorkspaceUnitCapacity,
  ): Promise<UnitCapacityDTO> {
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
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
