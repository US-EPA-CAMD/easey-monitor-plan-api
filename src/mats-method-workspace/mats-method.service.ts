import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/mats-method-update.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    @InjectRepository(MatsMethodWorkspaceRepository)
    private repository: MatsMethodWorkspaceRepository,
    private map: MatsMethodMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getMethod(methodId: string): Promise<MatsMethodDTO> {
    let result;
    try {
      result = await this.repository.findOne(methodId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Mats Method not found.', true, {
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
    let result;
    try {
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

      result = await this.repository.save(method);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }

  async updateMethod(
    methodId: string,
    locationId: string,
    payload: UpdateMatsMethodDTO,
    userId: string,
  ): Promise<MatsMethodDTO> {
    let result;
    try {
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

      result = await this.repository.save(method);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.map.one(result);
  }
}
