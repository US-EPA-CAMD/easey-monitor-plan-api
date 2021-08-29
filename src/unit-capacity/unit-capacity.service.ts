import { Injectable } from '@nestjs/common';

import { UnitCapacityRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityService {
  constructor(private readonly repository: UnitCapacityRepository) {}
}
