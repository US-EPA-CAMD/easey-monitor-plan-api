import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { UpdateSystemFuelFlowDTO } from 'src/dtos/update-system-fuel-flow.dto';

@Injectable()
export class SystemFuelFlowWorkspaceService {
  constructor(
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private repository: SystemFuelFlowWorkspaceRepository,
    private map: SystemFuelFlowMap,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    const results = await this.repository.getFuelFlows(monSysId);
    return this.map.many(results);
  }

  async getFuelFlow(id: string): Promise<SystemFuelFlowDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new NotFoundException('Fuel Flow not found.');
    }

    return this.map.one(result);
  }

  async updateFuelFlow(
    id: string,
    payload: UpdateSystemFuelFlowDTO,
  ): Promise<SystemFuelFlowDTO> {
    const fuelFlow = await this.getFuelFlow(id);

    fuelFlow.maxRate = payload.maxRate;
    fuelFlow.maxRateSourceCode = payload.maxRateSourceCode;
    fuelFlow.sysFuelUomCode = payload.sysFuelUomCode;
    fuelFlow.beginDate = payload.beginDate;
    fuelFlow.endDate = payload.endDate;
    fuelFlow.beginHour = payload.beginHour;
    fuelFlow.endHour = payload.endHour;

    const result = await this.repository.save(fuelFlow);

    return this.map.one(result);
  }
}
