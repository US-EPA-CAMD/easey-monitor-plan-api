import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { SystemComponent } from '../entities/system-component.entity';
import { SystemComponent as WorkspaceSystemComponent } from '../entities/workspace/system-component.entity';
import { SystemComponentDTO } from '../dtos/system-component.dto';

@Injectable()
export class SystemComponentMap extends BaseMap<
  SystemComponent | WorkspaceSystemComponent,
  SystemComponentDTO
> {
  public async one(
    entity: SystemComponent | WorkspaceSystemComponent,
  ): Promise<SystemComponentDTO> {
    return {
      id: entity.id,
      locationId: entity.component.locationId,
      monitoringSystemRecordId: entity.monitoringSystemRecordId,
      componentId: entity.componentRecordId,
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
