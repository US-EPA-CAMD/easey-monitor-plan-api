import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';
import { SystemFuelFlowRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class SystemFuelFlowService {
  constructor(
    @InjectRepository(SystemFuelFlowRepository)
    private repository: SystemFuelFlowRepository,
    private map: SystemFuelFlowMap,
    private readonly logger: Logger,
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
}
