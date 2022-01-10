import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorDefault } from '../entities/workspace/monitor-default.entity';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { validateObject } from '../utils';

@Injectable()
export class MonitorDefaultWorkspaceService {
  constructor(
    @InjectRepository(MonitorDefaultWorkspaceRepository)
    private repository: MonitorDefaultWorkspaceRepository,
    private map: MonitorDefaultMap,
    private Logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getDefault(
    locationId: string,
    defaultId: string,
  ): Promise<MonitorDefault> {
    const result = await this.repository.getDefault(locationId, defaultId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Monitor Default Not Found', true, {
        locationId: locationId,
        defaultId: defaultId,
      });
    }

    return result;
  }

  async createDefault(
    locationId: string,
    payload: UpdateMonitorDefaultDTO,
    userId: string,
  ): Promise<MonitorDefaultDTO> {
    const monDefault = this.repository.create({
      id: uuid(),
      locationId,
      parameterCode: payload.parameterCode,
      defaultValue: payload.defaultValue,
      defaultUnitsOfMeasureCode: payload.defaultUnitsOfMeasureCode,
      defaultPurposeCode: payload.defaultPurposeCode,
      fuelCode: payload.fuelCode,
      operatingConditionCode: payload.operatingConditionCode,
      defaultSourceCode: payload.defaultSourceCode,
      groupId: payload.groupId,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await validateObject(monDefault);
    await this.repository.save(monDefault);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(monDefault);
  }

  async updateDefault(
    locationId: string,
    defaultId: string,
    payload: UpdateMonitorDefaultDTO,
    userId: string,
  ): Promise<MonitorDefaultDTO> {
    const monDefault = await this.getDefault(locationId, defaultId);

    monDefault.parameterCode = payload.parameterCode;
    monDefault.defaultValue = payload.defaultValue;
    monDefault.defaultUnitsOfMeasureCode = payload.defaultUnitsOfMeasureCode;
    monDefault.defaultPurposeCode = payload.defaultPurposeCode;
    monDefault.fuelCode = payload.fuelCode;
    monDefault.operatingConditionCode = payload.operatingConditionCode;
    monDefault.defaultSourceCode = payload.defaultSourceCode;
    monDefault.groupId = payload.groupId;
    monDefault.beginDate = payload.beginDate;
    monDefault.beginHour = payload.beginHour;
    monDefault.endDate = payload.endDate;
    monDefault.endHour = payload.endHour;
    monDefault.userId = userId;
    monDefault.updateDate = new Date(Date.now());

    await validateObject(monDefault);
    await this.repository.save(monDefault);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(monDefault);
  }
}
