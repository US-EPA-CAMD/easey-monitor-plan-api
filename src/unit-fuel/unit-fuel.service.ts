import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { UnitFuelDTO } from '../dtos/unit-fuel.dto';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelService {
  constructor(
    @InjectRepository(UnitFuelRepository)
    readonly repository: UnitFuelRepository,
    readonly map: UnitFuelMap,
    private readonly logger: Logger,
  ) {}

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuelDTO[]> {
    let result;
    try {
      result = await this.repository.getUnitFuels(locId, unitId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
