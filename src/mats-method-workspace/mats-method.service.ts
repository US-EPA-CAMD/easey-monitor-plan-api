import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/mats-method-update.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { validateObject } from '../utils';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    @InjectRepository(MatsMethodWorkspaceRepository)
    private repository: MatsMethodWorkspaceRepository,
    private map: MatsMethodMap,
    private Logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MatsMethodDTO> {
    const result = await this.repository.findOne(methodId);

    if (!result) {
      this.Logger.error(NotFoundException, 'Mats Method not found.', true, {
        methodId: methodId,
      });
    }

    return this.map.one(result);
  }

  async createMethod(
    locationId: string,
    payload: UpdateMatsMethodDTO,
    userId: string,
  ): Promise<MatsMethodDTO> {
    const method = this.repository.create({
      id: uuid(),
      locationId,
      supplementalMATSParameterCode: payload.supplementalMATSParameterCode,
      supplementalMATSMonitoringMethodCode:
        payload.supplementalMATSMonitoringMethodCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    // Validate mats method
    const passed = await validateObject(method);

    // If mats method object passes...
    if (passed) {
      // Add the record to the database
      const result = await this.repository.save(method);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
      return this.map.one(result);
    }
    return new MatsMethodDTO();
  }

  async updateMethod(
    methodId: string,
    locationId: string,
    payload: UpdateMatsMethodDTO,
    userId: string,
  ): Promise<MatsMethodDTO> {
    const method = await this.getMethod(methodId);

    method.supplementalMATSParameterCode =
      payload.supplementalMATSParameterCode;
    method.supplementalMATSMonitoringMethodCode =
      payload.supplementalMATSMonitoringMethodCode;
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;
    method.userId = userId;
    method.updateDate = new Date(Date.now());

    // Validate mats method
    const passed = await validateObject(method);

    // If mats method object passes...
    if (passed) {
      // Update the record in the database
      const result = await this.repository.save(method);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
      return this.map.one(result);
    }
    return new MatsMethodDTO();
  }
}
