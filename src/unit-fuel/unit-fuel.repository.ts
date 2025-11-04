import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { UnitFuel } from '../entities/unit-fuel.entity';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

@Injectable()
export class UnitFuelRepository extends Repository<UnitFuel> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(UnitFuel, entityManager);
  }

  async getUnitFuels(unitId: number): Promise<UnitFuel[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
     return qr.createQueryBuilder(UnitFuel, 'uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
    })
  }

  async getUnitFuelByLocationIds(locationIds: string[]): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoin('uf.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
  }
}
