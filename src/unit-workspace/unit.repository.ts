import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Unit } from '../entities/workspace/unit.entity';

@Injectable()
export class UnitWorkspaceRepository extends Repository<Unit> {
  constructor(entityManager: EntityManager) {
    super(Unit, entityManager);
  }

  async getUnitsByMonPlanId(monPlanId: string) {
    return this.find({
      relations: {
        location: {
          plans: true,
        },
      },
      where: {
        location: {
          plans: {
            id: monPlanId,
          },
        },
      },
    });
  }
}
