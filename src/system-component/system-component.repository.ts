import { Repository, EntityRepository } from 'typeorm';

import { SystemComponent } from '../entities/system-component.entity';

@EntityRepository(SystemComponent)
export class SystemComponentRepository extends Repository<SystemComponent> {
  async getComponents(
    monLocId: string,
    monSysId: string,
  ): Promise<SystemComponent[]> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('c.monLocId = :monLocId', { monLocId })
      .andWhere('msc.monSysId = :monSysId', { monSysId })
      .orderBy('c.componentIdentifier', 'ASC')
      .getMany();
  }
}
