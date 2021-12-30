import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { UpdateMonitorMethodDTO } from '../dtos/monitor-method-update.dto';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MonitorMethodWorkspaceService {
  constructor(
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private repository: MonitorMethodWorkspaceRepository,
    private map: MonitorMethodMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locId: string): Promise<MonitorMethodDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId: locId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getMethod(methodId: string): Promise<MonitorMethod> {
    let result;
    try {
      result = await this.repository.findOne(methodId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Method Not Found', true, {
        methodId: methodId,
      });
    }

    return result;
  }

  async createMethod(
    locationId: string,
    payload: UpdateMonitorMethodDTO,
    userId: string,
  ): Promise<MonitorMethodDTO> {
    let entity;
    try {
      const monMethod = this.repository.create({
        id: uuid(),
        locationId,
        parameterCode: payload.parameterCode,
        substituteDataCode: payload.substituteDataCode,
        bypassApproachCode: payload.bypassApproachCode,
        monitoringMethodCode: payload.monitoringMethodCode,
        beginDate: payload.beginDate,
        beginHour: payload.beginHour,
        endDate: payload.endDate,
        endHour: payload.endHour,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      entity = await this.repository.save(monMethod);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(entity);
  }

  async updateMethod(
    methodId: string,
    payload: UpdateMonitorMethodDTO,
    locationId: string,
    userId: string,
  ): Promise<MonitorMethodDTO> {
    let result;
    try {
      const method = await this.getMethod(methodId);

      method.parameterCode = payload.parameterCode;
      method.substituteDataCode = payload.substituteDataCode;
      method.bypassApproachCode = payload.bypassApproachCode;
      method.monitoringMethodCode = payload.monitoringMethodCode;
      method.beginDate = payload.beginDate;
      method.beginHour = payload.beginHour;
      method.endDate = payload.endDate;
      method.endHour = payload.endHour;
      method.userId = userId;
      method.updateDate = new Date(Date.now());

      result = await this.repository.save(method);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }
}
