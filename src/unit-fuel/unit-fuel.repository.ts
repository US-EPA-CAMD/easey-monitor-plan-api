import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelRepository extends Repository<UnitFuel> {
  async getUnitFuels(locId: string, unitId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }
}
