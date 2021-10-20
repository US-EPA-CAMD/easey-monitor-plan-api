import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {
  async getUnitFuels(locId: string, unitRecordId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }

  async getUnitFuel(
    locId: string,
    unitRecordId: number,
    unitFuelId: string,
  ): Promise<UnitFuel> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .andWhere('uf.id = :unitRecordId', { unitFuelId })
      .getOne();
  }
}
