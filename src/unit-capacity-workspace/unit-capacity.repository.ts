import { EntityRepository, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityWorkspaceRepository extends Repository<UnitCapacity> {
  async getUnitCapacity(
    locId: string,
    unitId: number,
    unitCapacityId: string,
  ): Promise<UnitCapacity> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitId', { unitId })
      .andWhere('uc.id = :unitCapacityId', { unitCapacityId });

    return query.getOne();
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

  async getUnitCapacitiesByUnitIds(ids: number[]): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('u.id IN (:...ids)', { ids });

    return query.getMany();
  }
}
