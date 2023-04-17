import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitControl } from '../entities/unit-control.entity';
import { UnitControlDTO } from '../dtos/unit-control.dto';

@Injectable()
export class UnitControlMap extends BaseMap<UnitControl, UnitControlDTO> {
  public async one(entity: UnitControl): Promise<UnitControlDTO> {
    return {
      id: entity.id,
      unitRecordId: entity.unitId,
      parameterCode: entity.parameterCode,
      controlCode: entity.controlCode,
      originalCode: typeof entity.originalCode === 'string' ? parseInt(entity.originalCode) : entity.originalCode,
      installDate: entity.installDate,
      optimizationDate: entity.optimizationDate,
      seasonalControlsIndicator: typeof entity.seasonalControlsIndicator === 'string' ? parseInt(entity.seasonalControlsIndicator) : entity.seasonalControlsIndicator,
      retireDate: entity.retireDate,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.retireDate === null,
    };
  }
}
