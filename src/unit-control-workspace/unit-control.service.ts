import { Injectable } from '@nestjs/common';

import { UnitControlWorkspaceRepository } from './unit-control.repository';

@Injectable()
export class UnitControlWorkspaceService {
  constructor(private readonly repository: UnitControlWorkspaceRepository) {}
}
