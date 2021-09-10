import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { UpdateSystemFuelFlowDTO } from '../dtos/system-fuel-flow-update.dto';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly repository: SystemFuelFlowWorkspaceRepository,
    private readonly map: SystemFuelFlowMap,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    const results = await this.repository.getFuelFlows(monSysId);
    return this.map.many(results);
  }

  async getFuelFlow(fuelFlowId: string): Promise<SystemFuelFlowDTO> {
    const result = await this.repository.getFuelFlow(fuelFlowId);

    if (!result) {
      throw new NotFoundException('Fuel Flow not found.');
    }

    return this.map.one(result);
  }

  async createFuelFlow(
    monitoringSystemRecordId: string,
    payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = this.repository.create({
      id: uuid(),
      monitoringSystemRecordId,
      maximumFuelFlowRate: payload.maximumFuelFlowRate,
      maximumFuelFlowRateSourceCode: payload.maximumFuelFlowRateSourceCode,
      systemFuelFlowUOMCode: payload.systemFuelFlowUOMCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,

      // TODO: userId to be determined
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(fuelFlow);
    return this.map.one(result);
  }

  async updateFuelFlow(
    fuelFlowId: string,
    payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
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

    return this.getFuelFlow(fuelFlowId);
  }
}
