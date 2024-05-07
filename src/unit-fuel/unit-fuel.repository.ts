import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitFuel } from '../entities/unit-fuel.entity';

@Injectable()
export class UnitFuelRepository extends Repository<UnitFuel> {
  constructor(entityManager: EntityManager) {
    super(UnitFuel, entityManager);
  }

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }
}
