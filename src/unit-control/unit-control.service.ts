import { Injectable } from '@nestjs/common';

import { UnitControlRepository } from './unit-control.repository';

@Injectable()
export class UnitControlService {
  constructor(private readonly repository: UnitControlRepository) {}
}
