import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitProgram } from '../entities/unit-program.entity';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitProgramByProgramId(progId: string): Promise<UnitProgram> {
    const query = this.createQueryBuilder('up').where(
      'up.programId = :progId',
      { progId },
    );

    return query.getOne();
  }

  async getUnitProgramsByUnitRecordId(
    unitRecordId: number,
  ): Promise<UnitProgram[]> {
    return this.createQueryBuilder('up')
      .where('up.unitId = :unitRecordId', { unitRecordId })
      .getMany();
  }
}
