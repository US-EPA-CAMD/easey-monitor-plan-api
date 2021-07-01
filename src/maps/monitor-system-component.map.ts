import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorSystemComponent } from '../entities/monitor-system-component.entity';
import { MonitorSystemComponentDTO } from '../dtos/monitor-system-component.dto';

@Injectable()
export class SystemComponentMap extends BaseMap<
  MonitorSystemComponent,
  MonitorSystemComponentDTO
> {
  public async one(
    entity: MonitorSystemComponent,
  ): Promise<MonitorSystemComponentDTO> {
    return {
      id: entity.id,
      monSysId: entity.monSysId,
      componentId: entity.componentId,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      active: entity.endDate === null,
    };
  }
}
