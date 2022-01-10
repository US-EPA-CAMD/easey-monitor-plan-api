import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoad } from '../entities/workspace/monitor-load.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { validateObject } from '../utils';

@Injectable()
export class MonitorLoadWorkspaceService {
  constructor(
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private repository: MonitorLoadWorkspaceRepository,
    private map: MonitorLoadMap,
    private Logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getLoad(loadId: string): Promise<MonitorLoad> {
    const result = await this.repository.findOne(loadId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Monitor Load Not Found', true, {
        loadId: loadId,
      });
    }

    return result;
  }

  async createLoad(
    locationId: string,
    payload: UpdateMonitorLoadDTO,
    userId: string,
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
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    // Validate load
    await validateObject(load);
    await this.repository.save(load);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(load);
  }

  async updateLoad(
    locationId: string,
    loadId: string,
    payload: UpdateMonitorLoadDTO,
    userId: string,
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
    load.userId = userId;
    load.updateDate = new Date(Date.now());

    await validateObject(load);
    await this.repository.save(load);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(load);
  }
}
