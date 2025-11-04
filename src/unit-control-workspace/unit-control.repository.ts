import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitControl } from '../entities/workspace/unit-control.entity';

@Injectable()
export class UnitControlWorkspaceRepository extends Repository<UnitControl> {
  constructor(entityManager: EntityManager) {
    super(UnitControl, entityManager);
  }

  async getUnitControls(unitRecordId: number): Promise<UnitControl[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }

  async getUnitControl(unitControlId: string): Promise<UnitControl> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .where('uc.id = :unitControlId', { unitControlId })
      .getOne();
  }

  async getUnitControlByLogicalKey(
    unitRecordId: number,
    parameterCode: string,
    controlCode: string,
    installDate: Date | null,
  ): Promise<UnitControl | null> {
    const query = this.createQueryBuilder('uc')
      .where('uc.unitId = :unitRecordId', { unitRecordId })
      .andWhere('uc.parameterCode = :parameterCode', { parameterCode })
      .andWhere('uc.controlCode = :controlCode', { controlCode });

    if (installDate !== null) {
      query.andWhere('uc.installDate = :installDate', { installDate });
    } else {
      query.andWhere('uc.installDate IS NULL');
    }

    return query.getOne();
  }

}
