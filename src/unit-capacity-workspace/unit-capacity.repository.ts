import { EntityRepository, Repository } from 'typeorm';

import { UnitCapacity } from '../entities/workspace/unit-capacity.entity';

@EntityRepository(UnitCapacity)
export class UnitCapacityWorkspaceRepository extends Repository<UnitCapacity> {
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

  async getUnitCapacityByUnitIdAndDate(
    unitId: number,
    beginDate: Date,
    endDate: Date,
  ): Promise<UnitCapacity> {
    const query = this.createQueryBuilder('c')
      .where('c.unitId = :unitId', {
        unitId,
      });

    query.andWhere('c.beginDate = :beginDate OR (c.endDate IS NOT NULL AND c.endDate = :endDate)', {
      beginDate,
      endDate,
    });

    query.orderBy('c.unitId, c.endDate, c.maximumHourlyHeatInputCapacity')
    return query.getOne();
  }
}
