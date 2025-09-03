import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@Injectable()
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {
  constructor(entityManager: EntityManager) {
    super(UnitFuel, entityManager);
  }

  async getUnitFuels(unitId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }

  async getUnitFuel(unitFuelId: string): Promise<UnitFuel> {
    const query = this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .andWhere('uf.id = :unitFuelId', { unitFuelId });

    return query.getOne();
  }

  async getUnitFuelBySpecsBeginOrEndDate(
    unitId: number,
    fuelCode: string,
    beginDate: Date,
    endDate: Date | null,
  ): Promise<UnitFuel | null> {
    const qb = this.createQueryBuilder('u')
      .where('u.unitId = :unitId', { unitId })
      .andWhere('u.fuelCode = :fuelCode', { fuelCode })
      .andWhere('u.beginDate = :beginDate', { beginDate });

    const beginMatch = await qb.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null) {
      const endQuery = this.createQueryBuilder('u')
        .where('u.unitId = :unitId', { unitId })
        .andWhere('u.fuelCode = :fuelCode', { fuelCode })
        .andWhere('u.endDate = :endDate', { endDate });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }
}
