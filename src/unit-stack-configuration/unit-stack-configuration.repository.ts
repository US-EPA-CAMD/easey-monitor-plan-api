import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';

@Injectable()
export class UnitStackConfigurationRepository extends Repository<
  UnitStackConfiguration
> {
  constructor(entityManager: EntityManager) {
    super(UnitStackConfiguration, entityManager);
  }

  async getUnitStackConfigsByLocationIds(locationIds: string[]) {
    return this.createQueryBuilder('usc')
      .innerJoinAndSelect('usc.unit', 'u')
      .innerJoinAndSelect('usc.stackPipe', 'sp')
      .innerJoin('u.location', 'mlu')
      .innerJoin('sp.location', 'mlsp')
      .where('mlu.id IN (:...locationIds)', { locationIds })
      .andWhere('mlsp.id IN (:...locationIds)', { locationIds })
      .getMany();
  }
  async getUnitStackConfigsByUnitId(id: number | string, isUnit: boolean) {
    const query = this.createQueryBuilder('usc')
      .innerJoinAndSelect('usc.unit', 'u')
      .innerJoinAndSelect('usc.stackPipe', 'sp');
    if (isUnit) {
      query.where('u.id = :id', { id });
    } else {
      query.where('sp.id = :id', { id });
    }
    return query.getMany();
  }
}
