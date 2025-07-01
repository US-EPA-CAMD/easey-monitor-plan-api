import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitControl } from '../entities/workspace/unit-control.entity';

@Injectable()
export class UnitControlWorkspaceRepository extends Repository<UnitControl> {
  constructor(entityManager: EntityManager) {
    super(UnitControl, entityManager);
  }

  async getUnitControls(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitControl[]> {
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

  async getUnitControlBySpecsInstallOrRetireDate(
    unitRecordId: number,
    parameterCode: string,
    controlCode: string,
    installDate: Date | null,
    retireDate: Date | null,
  ): Promise<UnitControl | null> {
    const baseQuery = this.createQueryBuilder('uc')
      .where('uc.unitId = :unitRecordId', { unitRecordId })
      .andWhere('uc.parameterCode = :parameterCode', { parameterCode })
      .andWhere('uc.controlCode = :controlCode', { controlCode });

    if (installDate !== null) {
      baseQuery.andWhere('uc.installDate = :installDate', { installDate });
    } else {
      baseQuery.andWhere('uc.installDate IS NULL');
    }

    const installMatch = await baseQuery
      .orderBy('uc.unitId, uc.parameterCode, uc.controlCode, uc.installDate')
      .getOne();

    if (installMatch) return installMatch;

    if (retireDate !== null) {
      const retireQuery = this.createQueryBuilder('uc')
        .where('uc.unitId = :unitRecordId', { unitRecordId })
        .andWhere('uc.parameterCode = :parameterCode', { parameterCode })
        .andWhere('uc.controlCode = :controlCode', { controlCode })
        .andWhere('uc.retireDate = :retireDate', { retireDate });

      if (installDate !== null) {
        retireQuery.andWhere('uc.installDate = :installDate', { installDate });
      } else {
        retireQuery.andWhere('uc.installDate IS NULL');
      }

      return await retireQuery
        .orderBy('uc.unitId, uc.parameterCode, uc.controlCode, uc.installDate')
        .getOne();
    }

    return null;
  }

}
