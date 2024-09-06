import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitProgram } from '../entities/workspace/unit-program.entity';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitPrograms(locId: string, unitId: number): Promise<UnitProgram[]> {
    return this.createQueryBuilder('up')
      .where('up.unitId = :unitId', { unitId })
      .getMany();
  }

  async getUnitProgram(unitProgId: string): Promise<UnitProgram> {
    const query = this.createQueryBuilder('up')
      .where('up.programId = :unitProgId', { unitProgId });

    return query.getOne();
  }
}
