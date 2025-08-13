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
      .where('u.id IN (:...ids)', { ids })
      .orderBy('uc.id');

    return query.getMany();
  }

  async getUnitCapacityByUnitIdBeginOrEndDate(
    unitId: number,
    beginDate: Date,
    endDate: Date | null,
  ): Promise<UnitCapacity | null> {
    const query = this.createQueryBuilder('c')
      .where('c.unitId = :unitId', { unitId })
      .andWhere('c.beginDate = :beginDate', { beginDate });

    const beginMatch = await query
      .orderBy('c.unitId, c.endDate, c.maximumHourlyHeatInputCapacity')
      .getOne();

    if (beginMatch) return beginMatch;

    if (endDate !== null) {
      const endQuery = this.createQueryBuilder('c')
        .where('c.unitId = :unitId', { unitId })
        .andWhere('c.endDate = :endDate', { endDate });

      return await endQuery
        .orderBy('c.unitId, c.endDate, c.maximumHourlyHeatInputCapacity')
        .getOne();
    }

    return null;
  }

}
