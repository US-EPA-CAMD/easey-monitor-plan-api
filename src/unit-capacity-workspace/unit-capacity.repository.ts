import { EntityRepository, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityWorkspaceRepository extends Repository<UnitCapacity> {
  async getUnitCapacities(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitCapacity[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }

  async getUnitCapacity(
    locId: string,
    unitRecordId: number,
    unitCapacityId: string,
  ): Promise<UnitCapacity> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .andWhere('uc.id = :unitCapacityId', { unitCapacityId })
      .getOne();
  }
}
