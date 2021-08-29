import { Injectable } from '@nestjs/common';

import { UnitFuelRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelService {
  constructor(private readonly repository: UnitFuelRepository) {}
}
