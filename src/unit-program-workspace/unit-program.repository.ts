import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitProgram } from '../entities/workspace/unit-program.entity';

@Injectable()
export class UnitProgramWorkspaceRepository extends Repository<UnitProgram> {
  constructor(entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitProgramByProgramId(progId: string) {
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

  async getUnitProgramsByUnitRecordIds(
    unitRecordIds: number[],
  ): Promise<UnitProgram[]> {
    return this.createQueryBuilder('up')
      .innerJoinAndSelect('up.program', 'p')
      .innerJoinAndSelect('p.code', 'pc')
      .where('up.unitId IN (:...unitRecordIds)', { unitRecordIds })
      .getMany();
  }
}
