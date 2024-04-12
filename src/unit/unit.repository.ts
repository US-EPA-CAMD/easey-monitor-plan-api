import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Unit } from '../entities/unit.entity';

@Injectable()
export class UnitRepository extends Repository<Unit> {
  constructor(entityManager: EntityManager) {
    super(Unit, entityManager);
  }
}
