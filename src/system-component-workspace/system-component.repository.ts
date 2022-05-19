import { Repository, EntityRepository } from 'typeorm';

import { SystemComponent } from '../entities/workspace/system-component.entity';

@EntityRepository(SystemComponent)
export class SystemComponentWorkspaceRepository extends Repository<
  SystemComponent
> {
  async getSystemComponent(
    monSysId: string,
    monSysCompId: string,
  ): Promise<SystemComponent> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.id = :monSysCompId', { monSysCompId })
      .andWhere('msc.monitoringSystemRecordId = :monSysId', {
        monSysId,
      })
      .getOne();
  }

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

  async getComponentsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemComponent[]> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.monitoringSystemRecordId IN (:...monSysIds)', { monSysIds })
      .orderBy('c.componentId', 'ASC')
      .getMany();
  }

  async getComponenByBeginOrEndDate(
    monSysId: string,
    componentId: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<SystemComponent> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('c.componentId = :componentId', { componentId })
      .andWhere('msc.monitoringSystemRecordId = :monSysId', { monSysId })
      .andWhere('msc.beginDate = :beginDate', { beginDate })
      .andWhere('msc.beginHour = :beginHour', { beginHour })
      .getOne();
  }
}
