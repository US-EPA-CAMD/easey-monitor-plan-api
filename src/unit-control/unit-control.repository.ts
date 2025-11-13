import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitControl } from '../entities/unit-control.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

@Injectable()
export class UnitControlRepository extends Repository<UnitControl> {
  constructor( entityManager: EntityManager) {
    super(UnitControl, entityManager);
  }

  async getUnitControls(unitId: number): Promise<UnitControl[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
      return qr.createQueryBuilder(UnitControl, 'uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
    })
  }

  async getUnitControlsByLocationIds(locationIds: string[]): Promise<UnitControl[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
      return qr.createQueryBuilder(UnitControl, 'uc').addSelect('uc.fuelIndicatorCode')
      .innerJoin('uc.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
    })
  }
}
