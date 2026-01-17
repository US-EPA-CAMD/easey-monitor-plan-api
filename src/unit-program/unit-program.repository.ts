import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { UnitProgram } from '../entities/unit-program.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

@Injectable()
export class UnitProgramRepository extends Repository<UnitProgram> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(UnitProgram, entityManager);
  }

  async getUnitProgramByProgramId(progId: string): Promise<UnitProgram> {
     return withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitProgram,'up').where(
          'up.programId = :progId',
          { progId },
      ).getOne();
    })
  }

  async getUnitProgramsByUnitRecordId(
    unitRecordId: number,
  ): Promise<UnitProgram[]> {
    return withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitProgram, 'up')
      .where('up.unitId = :unitRecordId', { unitRecordId })
      .getMany();
    })
  }
}
