import { Injectable } from '@nestjs/common';

import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';

@Injectable()
export class UnitCapacityWorkspaceService {
  constructor(private readonly repository: UnitCapacityWorkspaceRepository) {}
}
