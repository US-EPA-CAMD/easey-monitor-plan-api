import { Repository, EntityRepository } from 'typeorm';

import { SystemComponent } from '../entities/workspace/system-component.entity';

@EntityRepository(SystemComponent)
export class SystemComponentWorkspaceRepository extends Repository<
  SystemComponent
> {
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

  async getComponent(
    monSysId: string,
    componentId: string,
  ): Promise<SystemComponent> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.monitoringSystemRecordId = :monSysId', {
        monSysId,
      })
      .andWhere('msc.componentRecordId = :componentId', { componentId })
      .getOne();
  }
}
