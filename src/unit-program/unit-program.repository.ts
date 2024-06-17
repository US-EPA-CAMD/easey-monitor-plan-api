import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitProgram } from '../entities/unit-program.entity';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }
}
