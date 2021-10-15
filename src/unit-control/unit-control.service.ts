import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitControlDTO } from '../dtos/unit-control.dto';
import { UnitControlMap } from '../maps/unit-control.map';

import { UnitControlRepository } from './unit-control.repository';

@Injectable()
export class UnitControlService {
  constructor(
    @InjectRepository(UnitControlRepository)
    private repository: UnitControlRepository,
    private map: UnitControlMap,
  ) {}

  async getUnitControls(unitId: number): Promise<UnitControlDTO[]> {
    const results = await this.repository.find({ unitId });
    return this.map.many(results);
  }
}
