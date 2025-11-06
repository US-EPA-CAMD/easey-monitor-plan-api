import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { UnitProgram } from '../entities/unit-program.entity';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitProgramByProgramId(progId: string): Promise<UnitProgram> {
     return useSlaveQueryRunner(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitProgram,'up').where(
          'up.programId = :progId',
          { progId },
      ).getOne();
    })
  }

  async getUnitProgramsByUnitRecordId(
    unitRecordId: number,
  ): Promise<UnitProgram[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitProgram, 'up')
      .where('up.unitId = :unitRecordId', { unitRecordId })
      .getMany();
    })
  }
}
