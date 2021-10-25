import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorDefault } from '../entities/monitor-default.entity';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';

@Injectable()
export class MonitorDefaultMap extends BaseMap<
  MonitorDefault,
  MonitorDefaultDTO
> {
  public async one(entity: MonitorDefault): Promise<MonitorDefaultDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      parameterCode: entity.parameterCode,
      defaultValue: entity.defaultValue,
      defaultUnitsOfMeasureCode: entity.defaultUnitsOfMeasureCode,
      defaultPurposeCode: entity.defaultPurposeCode,
      fuelCode: entity.fuelCode,
      operatingConditionCode: entity.operatingConditionCode,
      defaultSourceCode: entity.defaultSourceCode,
      groupId: entity.groupId,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
