import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';
import { UnitStackConfiguration as UnitStackConfigurationWorkspace } from '../entities/workspace/unit-stack-configuration.entity';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';

@Injectable()
export class UnitStackConfigurationMap extends BaseMap<
  UnitStackConfiguration | UnitStackConfigurationWorkspace,
  UnitStackConfigurationDTO
> {
  public async one(
    entity: UnitStackConfiguration | UnitStackConfigurationWorkspace,
  ): Promise<UnitStackConfigurationDTO> {
    return {
      id: entity.id,
      unitId: entity.unit ? entity.unit.name : null,
      stackPipeId: entity.stackPipe ? entity.stackPipe.name : null,
      unitRecordId: entity.unitId,
      stackPipeRecordId: entity.stackPipeId,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
