import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { UnitCapacity } from '../entities/unit-capacity.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

@Injectable()
export class UnitCapacityRepository extends Repository<UnitCapacity> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(UnitCapacity, entityManager);
  }

  async getUnitCapacities(unitId: number): Promise<UnitCapacity[]> {
     const query = withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitCapacity, 'uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
     })
    return query;
  }

  async getUnitCapacitiesByLocationIds(
    locationIds: string[]
  ): Promise<UnitCapacity[]> {
    const query = withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitCapacity, 'uc')
      .innerJoin('uc.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
    })
    return query;
  }

  async getUnitCapacitiesByUnitIds(ids: number[]): Promise<UnitCapacity[]> {
    const query = withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(UnitCapacity,'uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.unitBoilerType', 'ubt')
      .where('u.id IN (:...ids)', { ids })
      .orderBy('uc.id')
      .getMany();
    });

    return query;
  }
}
