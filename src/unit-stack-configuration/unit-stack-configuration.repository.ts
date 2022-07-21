import { EntityRepository, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';

@EntityRepository(UnitStackConfiguration)
export class UnitStackConfigurationRepository extends Repository<
  UnitStackConfiguration
> {
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
}
