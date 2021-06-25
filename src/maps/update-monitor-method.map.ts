import { Injectable } from '@nestjs/common';
import { UpdateMonitorMethodDTO } from 'src/dtos/update-monitor-method.dto';
import { MonitorMethod } from 'src/entities/monitor-method.entity';
import { BaseMap } from './base.map';

@Injectable()
export class UpdateMonitorMethodMap extends BaseMap<
  MonitorMethod,
  UpdateMonitorMethodDTO
> {
  public async one(entity: MonitorMethod): Promise<UpdateMonitorMethodDTO> {
    return {
      methodCode: entity.methodCode,
      parameterCode: entity.parameterCode,
      subDataCode: entity.subDataCode,
      byPassApproachCode: entity.bypassApproachCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
    };
  }
}
