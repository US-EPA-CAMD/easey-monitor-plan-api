import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { UnitOpStatusDTO } from 'src/dtos/unit-op-status.dto';
import { UnitOpStatusMap } from 'src/maps/unit-op-status.map';
import { UnitOpStatusRepository } from 'src/monitor-location/unit-op-status.repository';

@Injectable()
export class UnitOpStatusService {
  constructor(@InjectRepository(UnitOpStatusRepository)
    private repository: UnitOpStatusRepository,
    private map: UnitOpStatusMap,
  ) {}

}
