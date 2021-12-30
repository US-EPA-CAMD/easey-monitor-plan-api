import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorLoadDTO } from '../dtos/monitor-load-update.dto';
import { MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorLoadWorkspaceService {
  constructor(
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private repository: MonitorLoadWorkspaceRepository,
    private map: MonitorLoadMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getLoads(locationId: string): Promise<MonitorLoadDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getLoad(loadId: string): Promise<MonitorLoadDTO> {
    let result;
    try {
      result = await this.repository.findOne(loadId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Load Not Found', true, {
        loadId: loadId,
      });
    }

    return this.map.one(result);
  }

  async createLoad(
    locationId: string,
    payload: UpdateMonitorLoadDTO,
    userId: string,
  ): Promise<MonitorLoadDTO> {
    let result;
    try {
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

      result = await this.repository.save(load);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateLoad(
    locationId: string,
    loadId: string,
    payload: UpdateMonitorLoadDTO,
    userId: string,
  ): Promise<MonitorLoadDTO> {
    try {
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
      load.maximumLoadUnitsOfMeasureCode =
        payload.maximumLoadUnitsOfMeasureCode;
      load.userId = userId;
      load.updateDate = new Date(Date.now());

      await this.repository.save(load);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getLoad(loadId);
  }
}
