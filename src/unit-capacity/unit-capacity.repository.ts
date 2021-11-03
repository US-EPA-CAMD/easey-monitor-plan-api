import { EntityRepository, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityRepository extends Repository<UnitCapacity> {
  async getUnitCapacities(
    locId: string,
    unitId: number,
  ): Promise<UnitCapacity[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
  }
}
