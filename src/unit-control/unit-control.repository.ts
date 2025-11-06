import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { UnitControl } from '../entities/unit-control.entity';
import { useSlaveQueryRunner } from '../utilities/use-slave-query';

@Injectable()
export class UnitControlRepository extends Repository<UnitControl> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(UnitControl, entityManager);
  }

  async getUnitControls(unitId: number): Promise<UnitControl[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
      return qr.createQueryBuilder(UnitControl, 'uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitId', { unitId })
      .getMany();
    })
  }

  async getUnitControlsByLocationIds(locationIds: string[]): Promise<UnitControl[]> {
    return useSlaveQueryRunner(this.dataSource, async (qr) => {
      return qr.createQueryBuilder(UnitControl, 'uc').addSelect('uc.fuelIndicatorCode')
      .innerJoin('uc.unit', 'u')
      .innerJoin('u.location', 'l')
      .where('l.id IN (:...locationIds)', { locationIds })
      .getMany();
    })
  }
}
