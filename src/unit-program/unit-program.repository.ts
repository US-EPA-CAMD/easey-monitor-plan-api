import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitProgram } from '../entities/unit-program.entity';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitProgramsByUnitIds(unitIds: number[]): Promise<UnitProgram[]> {
    return this.createQueryBuilder('up')
      .innerJoinAndSelect('up.program', 'p')
      .innerJoinAndSelect('p.code', 'pc')
      .where('up.unitId IN (:...unitIds)', { unitIds })
      .getMany();
  }
}
