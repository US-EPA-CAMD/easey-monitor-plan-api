import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitControl } from '../entities/unit-control.entity';
import { UnitControl as WorkspaceUnitControl } from '../entities/workspace/unit-control.entity';
import { UnitControlDTO } from '../dtos/unit-control.dto';

@Injectable()
export class UnitControlMap extends BaseMap<
  UnitControl | WorkspaceUnitControl,
  UnitControlDTO
> {
  public async one(
    entity: UnitControl | WorkspaceUnitControl,
  ): Promise<UnitControlDTO> {
    return {
      id: entity.id,
      unitRecordId: entity.unitId,
      parameterCode: entity.parameterCode,
      controlCode: entity.controlCode,
      originalCode: entity.originalCode,
      installDate: entity.installDate,
      optimizationDate: entity.optimizationDate,
      seasonalControlsIndicator: entity.seasonalControlsIndicator,
      retireDate: entity.retireDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.retireDate === null,
    };
  }
}
