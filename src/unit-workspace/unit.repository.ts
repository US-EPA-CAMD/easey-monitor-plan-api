import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Unit } from '../entities/workspace/unit.entity';

@Injectable()
export class UnitWorkspaceRepository extends Repository<Unit> {
  constructor(entityManager: EntityManager) {
    super(Unit, entityManager);
  }
}
