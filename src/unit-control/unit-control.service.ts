import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';

import { UnitControlRepository } from './unit-control.repository';

@Injectable()
export class UnitControlService {
  constructor(
    @InjectRepository(UnitControlRepository)
    readonly repository: UnitControlRepository,
    readonly map: UnitControlMap,
    private readonly logger: Logger,
  ) {}

  async getUnitControls(
    locId: string,
    unitId: number,
  ): Promise<UnitControlDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitControls(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
