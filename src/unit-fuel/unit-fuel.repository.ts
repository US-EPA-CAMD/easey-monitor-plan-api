import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitFuel } from '../entities/unit-fuel.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

@Injectable()
export class UnitFuelRepository extends Repository<UnitFuel> {
  constructor( entityManager: EntityManager) {
    super(UnitFuel, entityManager);
  }

  async getUnitFuels(unitId: number): Promise<UnitFuel[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
     return qr.createQueryBuilder(UnitFuel, 'uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
    });
  }

  async getUnitFuelByLocationIds(locationIds: string[]): Promise<UnitFuel[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
     return qr.createQueryBuilder(UnitFuel,'uf')
      .innerJoin('uf.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
    });
  }
}
