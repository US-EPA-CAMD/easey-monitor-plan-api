import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { UpdateSystemFuelFlowDTO } from '../dtos/system-fuel-flow-update.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly repository: SystemFuelFlowWorkspaceRepository,
    private readonly map: SystemFuelFlowMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    let result;
    try {
      result = await this.repository.getFuelFlows(monSysId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }

  async getFuelFlow(fuelFlowId: string): Promise<SystemFuelFlowDTO> {
    let result;
    try {
      result = await this.repository.getFuelFlow(fuelFlowId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    if (!result) {
      this.logger.error(NotFoundException, 'Fuel Flow not found.', true, {
        fuelFlowId: fuelFlowId,
      });
    }

    return this.map.one(result);
  }

  async createFuelFlow(
    monitoringSystemRecordId: string,
    payload: UpdateSystemFuelFlowDTO,
    locId: string,
    userId: string,
  ): Promise<SystemFuelFlowDTO> {
    let fuelFlow;
    try {
      fuelFlow = this.repository.create({
        id: uuid(),
        monitoringSystemRecordId,
        maximumFuelFlowRate: payload.maximumFuelFlowRate,
        maximumFuelFlowRateSourceCode: payload.maximumFuelFlowRateSourceCode,
        systemFuelFlowUOMCode: payload.systemFuelFlowUOMCode,
        beginDate: payload.beginDate,
        beginHour: payload.beginHour,
        endDate: payload.endDate,
        endHour: payload.endHour,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      await this.repository.save(fuelFlow);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getFuelFlow(fuelFlow.id);
  }

  async updateFuelFlow(
    fuelFlowId: string,
    payload: UpdateSystemFuelFlowDTO,
    locId: string,
    userId: string,
  ): Promise<SystemFuelFlowDTO> {
    try {
      const fuelFlow = await this.getFuelFlow(fuelFlowId);

      fuelFlow.maximumFuelFlowRate = payload.maximumFuelFlowRate;
      fuelFlow.systemFuelFlowUOMCode = payload.systemFuelFlowUOMCode;
      fuelFlow.maximumFuelFlowRateSourceCode =
        payload.maximumFuelFlowRateSourceCode;
      fuelFlow.beginDate = payload.beginDate;
      fuelFlow.endDate = payload.endDate;
      fuelFlow.beginHour = payload.beginHour;
      fuelFlow.endHour = payload.endHour;

      await this.repository.save(fuelFlow);
      await this.mpService.resetToNeedsEvaluation(locId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return this.getFuelFlow(fuelFlowId);
  }
}
