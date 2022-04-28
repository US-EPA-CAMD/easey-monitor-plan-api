import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodBaseDTO, MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethod } from '../entities/workspace/mats-method.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MatsMethodWorkspaceRepository } from './mats-method.repository';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    @InjectRepository(MatsMethodWorkspaceRepository)
    private readonly repository: MatsMethodWorkspaceRepository,
    private readonly map: MatsMethodMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MatsMethod> {
    const result = await this.repository.findOne(methodId);

    if (!result) {
      this.logger.error(NotFoundException, 'Mats Method not found.', true, {
        methodId: methodId,
      });
    }

    return result;
  }

  async createMethod(
    locationId: string,
    payload: MatsMethodBaseDTO,
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

    await this.repository.save(method);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(method);
  }

  async updateMethod(
    methodId: string,
    locationId: string,
    payload: MatsMethodBaseDTO,
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

    await this.repository.save(method);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(method);
  }
}
