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

  async getUnitControlBySpecs(
    unitRecordId: number,
    parameterCode: string,
    controlCode: string,
    installDate: Date,
    retireDate: Date,
  ): Promise<UnitControl> {
    const query = this.createQueryBuilder('uc')
      .where('uc.unitId = :unitRecordId', {
        unitRecordId,
      })
      .andWhere('uc.parameterCode = :parameterCode', {
        parameterCode,
      })
      .andWhere('uc.controlCode = :controlCode', { controlCode });

    if (installDate) {
      query.andWhere(
        `uc.installDate = :installDate`,
        {installDate,},
      );
      if (retireDate !== null) {
        query.andWhere(
          '(uc.retireDate = :retireDate)',
          { retireDate, }
        );
      } else {
        query.andWhere('uc.retireDate IS NULL');
      }
    } else {
      query.andWhere(
        `uc.installDate IS NULL`,
        {installDate,},
      );
      if (retireDate !== null) {
        query.andWhere(
          '(uc.retireDate = :retireDate)',
          { retireDate, }
        );
      } else {
        query.andWhere('uc.retireDate IS NULL');
      }
    }

    query.orderBy(
      'uc.unitId, uc.parameterCode, uc.controlCode, uc.installDate',
    );

    return await query.getOne();
  }
}
