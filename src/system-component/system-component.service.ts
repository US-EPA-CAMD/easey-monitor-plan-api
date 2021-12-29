import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { SystemComponentDTO } from '../dtos/system-component.dto';
import { SystemComponentMap } from '../maps/system-component.map';
import { SystemComponentRepository } from './system-component.repository';

@Injectable()
export class SystemComponentService {
  constructor(
    @InjectRepository(SystemComponentRepository)
    private repository: SystemComponentRepository,
    private map: SystemComponentMap,
    private logger: Logger,
  ) {}

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    let result;
    try {
      result = await this.repository.getComponents(locationId, monSysId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
