import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';

@Injectable()
export class UnitStackConfigurationMap extends BaseMap<
  UnitStackConfiguration,
  UnitStackConfigurationDTO
> {
  public async one(
    entity: UnitStackConfiguration,
  ): Promise<UnitStackConfigurationDTO> {
    return {
      stackName: entity.stackPipe.name,
      id: entity.id,
      unitId: entity.unitId,
      stackPipeId: entity.stackPipeId,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
