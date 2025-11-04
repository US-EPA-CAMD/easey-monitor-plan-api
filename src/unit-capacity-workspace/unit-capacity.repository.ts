import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

@Injectable()
export class UnitCapacityWorkspaceRepository extends Repository<UnitCapacity> {
  constructor(entityManager: EntityManager) {
    super(UnitCapacity, entityManager);
  }

  async getUnitCapacity(unitCapacityId: string): Promise<UnitCapacity> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('uc.id = :unitCapacityId', { unitCapacityId });

    return query.getOne();
  }

  async getUnitCapacities(unitId: number): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .andWhere('u.id = :unitId', { unitId });

    return query.getMany();
  }

  async getUnitCapacitiesByUnitIds(ids: number[]): Promise<UnitCapacity[]> {
    const query = this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('u.id IN (:...ids)', { ids })
      .orderBy('uc.id');

    return query.getMany();
  }

  async getUnitCapacityByLogicalKey(
    unitId: number,
    beginDate: Date,
  ): Promise<UnitCapacity | null> {
    return this.createQueryBuilder('uc')
      .where('uc.unitId = :unitId', { unitId })
      .andWhere('uc.beginDate = :beginDate', { beginDate })
      .getOne();
  }
}
