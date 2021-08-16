import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';

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
}
