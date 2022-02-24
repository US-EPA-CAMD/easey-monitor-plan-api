import { Repository, EntityRepository } from 'typeorm';

import { SystemComponent } from '../entities/system-component.entity';

@EntityRepository(SystemComponent)
export class SystemComponentRepository extends Repository<SystemComponent> {
  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponent[]> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('c.locationId = :locationId', { locationId })
      .andWhere('msc.monitoringSystemRecordId = :monSysId', { monSysId })
      .orderBy('c.componentId', 'ASC')
      .getMany();
  }

  async getComponentsBySystemIds(monSysIds: string[]): Promise<SystemComponent[]> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.monitoringSystemRecordId IN (:...monSysIds)', { monSysIds })
      .orderBy('c.componentId', 'ASC')
      .getMany();
  }
}
