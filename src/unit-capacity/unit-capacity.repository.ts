import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';

@Injectable()
export class UnitCapacityRepository extends Repository<UnitCapacity> {
  constructor(entityManager: EntityManager) {
    super(UnitCapacity, entityManager);
  }

  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoin('u.location', 'l')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitId', { unitId });

    return query.getMany();
  }

  async getUnitCapacitiesByLocationIds(
    locationIds: string[]
  ): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoin('uc.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })

    return query.getMany();
  }

  async getUnitCapacitiesByUnitIds(ids: number[]): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('u.id IN (:...ids)', { ids })
      .orderBy('uc.id');

    return query.getMany();
  }
}
