import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultDTO } from '../dtos/monitor-default.dto';
import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { UpdateMonitorDefaultDTO } from '../dtos/monitor-default-update.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorDefaultWorkspaceService {
  constructor(
    @InjectRepository(MonitorDefaultWorkspaceRepository)
    private repository: MonitorDefaultWorkspaceRepository,
    private map: MonitorDefaultMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDefaults(locationId: string): Promise<MonitorDefaultDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getDefault(
    locationId: string,
    defaultId: string,
  ): Promise<MonitorDefaultDTO> {
    let result;
    try {
      result = await this.repository.getDefault(locationId, defaultId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Default Not Found', true, {
        locationId: locationId,
        defaultId: defaultId,
      });
    }

    return this.map.one(result);
  }

  async createDefault(
    locationId: string,
    payload: UpdateMonitorDefaultDTO,
    userId: string,
  ): Promise<MonitorDefaultDTO> {
    let result;
    try {
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

      result = await this.repository.save(monDefault);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateDefault(
    locationId: string,
    defaultId: string,
    payload: UpdateMonitorDefaultDTO,
    userId: string,
  ): Promise<MonitorDefaultDTO> {
    try {
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

      await this.repository.save(monDefault);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getDefault(locationId, defaultId);
  }
}
