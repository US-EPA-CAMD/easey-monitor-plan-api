import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {
  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }

  async getUnitFuel(
    locId: string,
    unitId: number,
    unitFuelId: string,
  ): Promise<UnitFuel> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitId', { unitId })
      .andWhere('uf.id = :unitFuelId', { unitFuelId })
      .getOne();
  }
}
