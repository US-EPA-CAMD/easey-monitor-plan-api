import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getLoad(loadId: string): Promise<MonitorLoadDTO> {
    const result = await this.repository.findOne(loadId);

    if (!result) {
      throw new NotFoundException('Monitor Load not found');
    }

    return this.map.one(result);
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
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);

    return this.map.one(result);
  }

  async updateLoad(
    locationId: string,
    loadId: string,
    payload: UpdateMonitorLoadDTO,
  ): Promise<MonitorLoadDTO> {
    const load = await this.getLoad(loadId);

    load.loadAnalysisDate = payload.loadAnalysisDate;
    load.beginDate = payload.beginDate;
    load.beginHour = payload.beginHour;
    load.endDate = payload.endDate;
    load.endHour = payload.endHour;
    load.maximumLoadValue = payload.maximumLoadValue;
    load.secondNormalIndicator = payload.secondNormalIndicator;
    load.upperOperationBoundary = payload.upperOperationBoundary;
    load.lowerOperationBoundary = payload.lowerOperationBoundary;
    load.normalLevelCode = payload.normalLevelCode;
    load.secondLevelCode = payload.secondLevelCode;
    load.maximumLoadUnitsOfMeasureCode = payload.maximumLoadUnitsOfMeasureCode;
    // TODO
    load.userId = 'testuser';
    load.updateDate = new Date(Date.now());

    await this.repository.save(load);

    return this.getLoad(loadId);
  }
}
