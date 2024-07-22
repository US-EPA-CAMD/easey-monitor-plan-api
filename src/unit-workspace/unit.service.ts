import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UnitMap } from '../maps/unit.map';
import { withTransaction } from '../utils';
import { UnitWorkspaceRepository } from './unit.repository';

@Injectable()
export class UnitWorkspaceService {
  constructor(
    private readonly repository: UnitWorkspaceRepository,
    private readonly map: UnitMap,
  ) {}

  async getUnitsByMonPlanId(monPlanId: string, trx?: EntityManager) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitsByMonPlanId(monPlanId);
    return this.map.many(results);
  }
}
