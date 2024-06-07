import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@Injectable()
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {
  constructor(entityManager: EntityManager) {
    super(UnitFuel, entityManager);
  }

  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }

  async getUnitFuel(unitFuelId: string): Promise<UnitFuel> {
    const query = this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .andWhere('uf.id = :unitFuelId', { unitFuelId });

    return query.getOne();
  }

  async getUnitFuelBySpecs(
    unitId: number,
    fuelCode: string,
    beginDate: Date,
    endDate: Date,
  ): Promise<UnitFuel> {
    const qb = this.createQueryBuilder('u')
      .where('u.unitId = :unitId', {
        unitId,
      })
      .andWhere('u.fuelCode = :fuelCode', {
        fuelCode,
      })
      .andWhere(
        `((
          u.beginDate = :beginDate
        ) OR (
          u.endDate IS NOT NULL AND u.endDate = :endDate
        ))`,
        {
          beginDate,
          endDate,
        },
      );

    return qb.getOne();
  }
}
