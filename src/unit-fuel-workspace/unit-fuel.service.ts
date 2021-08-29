import { Injectable } from '@nestjs/common';

import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';

@Injectable()
export class UnitFuelWorkspaceService {
  constructor(private readonly repository: UnitFuelWorkspaceRepository) {}
}
