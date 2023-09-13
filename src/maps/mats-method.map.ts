import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MatsMethod } from '../entities/mats-method.entity';
import { MatsMethod as WorkspaceMatsMethod } from '../entities/workspace/mats-method.entity';
import { MatsMethodDTO } from '../dtos/mats-method.dto';

@Injectable()
export class MatsMethodMap extends BaseMap<
  MatsMethod | WorkspaceMatsMethod,
  MatsMethodDTO
> {
  public async one(
    entity: MatsMethod | WorkspaceMatsMethod,
  ): Promise<MatsMethodDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      supplementalMATSParameterCode: entity.supplementalMATSParameterCode,
      supplementalMATSMonitoringMethodCode:
        entity.supplementalMATSMonitoringMethodCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
