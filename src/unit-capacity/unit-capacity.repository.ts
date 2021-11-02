import { EntityRepository, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityRepository extends Repository<UnitCapacity> {
  async getUnitCapacities(
    locId: string,
    unitRecordId,
  ): Promise<UnitCapacity[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }
}
