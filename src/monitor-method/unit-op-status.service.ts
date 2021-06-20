import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';

@Injectable()
export class UnitOpStatusService {
  constructor(
    @InjectRepository(UnitOpStatusRepository)
    private repository: UnitOpStatusRepository,
    private map: UnitOpStatusMap,
  ) {}
}
