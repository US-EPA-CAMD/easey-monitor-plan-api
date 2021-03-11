import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import {MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemDTO } from '../dtos/monitor-system.dto';

@Injectable()
export class MonitorSystemMap extends BaseMap<MonitorSystem, MonitorSystemDTO> {
  public async one(entity: MonitorSystem): Promise<MonitorSystemDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      systemType: entity.systemType,
      systemDesignationCode: entity.systemDesignationCode,
      fuelCode: entity.fuelCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour
    };
  }
}
