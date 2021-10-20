import { EntityRepository, Repository } from 'typeorm';

import { UnitFuel } from '../entities/workspace/unit-fuel.entity';

@EntityRepository(UnitFuel)
export class UnitFuelWorkspaceRepository extends Repository<UnitFuel> {
  async getUnitFuels(locId: string, unitRecordId: number): Promise<UnitFuel[]> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }
}
