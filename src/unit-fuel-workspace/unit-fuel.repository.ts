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

  async getUnitFuelByLogicalKey(
    unitId: number,
    fuelCode: string,
    beginDate: Date,
  ): Promise<UnitFuel | null> {
    return this.createQueryBuilder('uf')
      .where('uf.unitId = :unitId', { unitId })
      .andWhere('uf.fuelCode = :fuelCode', { fuelCode })
      .andWhere('uf.beginDate = :beginDate', { beginDate })
      .getOne();
  }
}
