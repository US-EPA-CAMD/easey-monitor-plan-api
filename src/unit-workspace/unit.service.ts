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

  async getUnitsByFacId(facId: number) {
    const results = await this.repository.find({
      where: { facId },
      relations: {
        location: {
          methods: true,
          plans: true,
        },
        opStatuses: true,
      },
    });
    return this.map.many(results);
  }

  async getUnitsByMonPlanId(monPlanId: string, trx?: EntityManager) {
    const results = await withTransaction(
      this.repository,
      trx,
    ).getUnitsByMonPlanId(monPlanId);
    return this.map.many(results);
  }
}
