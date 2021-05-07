import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorLoad } from '../entities/monitor-load.entity';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';

@Injectable()
export class MonitorLoadMap extends BaseMap<MonitorLoad, MonitorLoadDTO> {
  public async one(entity: MonitorLoad): Promise<MonitorLoadDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      loadAnalysisDate: entity.loadAnalysisDate,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      maxLoadValue: entity.maxLoadValue,
      secondNormalInd: entity.secondNormalInd,
      upOpBoundary: entity.upOpBoundary,
      lowOpBoundary: entity.lowOpBoundary,
      normalLevelCd: entity.normalLevelCd,
      secondLevelCd: entity.secondLevelCd,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      maxLoadUomCd: entity.maxLoadUomCd,
    };
  }
}
