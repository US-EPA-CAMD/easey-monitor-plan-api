import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorLoad } from '../entities/monitor-load.entity';
import { MonitorLoad as WorkspaceMonitorLoad } from '../entities/workspace/monitor-load.entity';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';

@Injectable()
export class MonitorLoadMap extends BaseMap<
  MonitorLoad | WorkspaceMonitorLoad,
  MonitorLoadDTO
> {
  public async one(
    entity: MonitorLoad | WorkspaceMonitorLoad,
  ): Promise<MonitorLoadDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      loadAnalysisDate: entity.loadAnalysisDate,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      maximumLoadValue: entity.maximumLoadValue,
      secondNormalIndicator: entity.secondNormalIndicator,
      upperOperationBoundary: entity.upperOperationBoundary,
      lowerOperationBoundary: entity.lowerOperationBoundary,
      normalLevelCode: entity.normalLevelCode,
      secondLevelCode: entity.secondLevelCode,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      maximumLoadUnitsOfMeasureCode: entity.maximumLoadUnitsOfMeasureCode,
      active: entity.endDate === null,
    };
  }
}
