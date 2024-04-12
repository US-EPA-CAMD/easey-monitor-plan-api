import { Injectable } from '@nestjs/common';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';

@Injectable()
export class SystemFuelFlowService {
  constructor(
    private repository: SystemFuelFlowRepository,
    private map: SystemFuelFlowMap,
  ) {}

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlowDTO[]> {
    const results = await this.repository.getFuelFlows(monSysId);
    return this.map.many(results);
  }
}
