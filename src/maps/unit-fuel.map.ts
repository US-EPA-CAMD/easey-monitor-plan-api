import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitFuel } from '../entities/unit-fuel.entity';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

@Injectable()
export class UnitFuelMap extends BaseMap<UnitFuel, UnitFuelDTO> {
  public async one(entity: UnitFuel): Promise<UnitFuelDTO> {
    return {
      id: entity.id,
      unitId: entity.unitId,
      fuelCode: entity.fuelCode,
      indicatorCode: entity.indicatorCode,
      ozoneSeasonIndicator: entity.ozoneSeasonIndicator,
      demGCV: entity.demGCV,
      demSO2: entity.demSO2,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      actualOrProjectCode: entity.actualOrProjectedCode,
      sulfurContent: entity.sulfurContent,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
