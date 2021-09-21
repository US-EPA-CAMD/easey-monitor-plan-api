import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';

@Injectable()
export class MonitorLoadWorkspaceService {
  constructor(
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private repository: MonitorLoadWorkspaceRepository,
    private map: MonitorLoadMap,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async createLoad(
    locationId: string,
    payload: UpdateMonitorLoadDTO,
  ): Promise<MonitorLoadDTO> {
    const load = this.repository.create({
      id: uuid(),
      locationId,
      loadAnalysisDate: payload.loadAnalysisDate,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      maximumLoadValue: payload.maximumLoadValue,
      secondNormalIndicator: payload.secondNormalIndicator,
      upperOperationBoundary: payload.upperOperationBoundary,
      lowerOperationBoundary: payload.lowerOperationBoundary,
      normalLevelCode: payload.normalLevelCode,
      secondLevelCode: payload.secondLevelCode,
      maximumLoadUnitsOfMeasureCode: payload.maximumLoadUnitsOfMeasureCode,
      // TODO
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);

    return this.map.one(result);
  }
}
