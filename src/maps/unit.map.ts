import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { Unit } from '../entities/unit.entity';
import { Unit as UnitWorkspace } from '../entities/workspace/unit.entity';
import { UnitDTO } from '../dtos/unit.dto';

@Injectable()
export class UnitMap extends BaseMap<Unit | UnitWorkspace, UnitDTO> {
  public async one(entity: Unit | UnitWorkspace): Promise<UnitDTO> {
    return {
      id: entity.id,
      unitId: entity.name,
      facilityId: entity.facId,
    };
  }
}
