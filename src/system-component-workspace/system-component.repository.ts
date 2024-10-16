import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SystemComponent } from '../entities/workspace/system-component.entity';

@Injectable()
export class SystemComponentWorkspaceRepository extends Repository<
  SystemComponent
> {
  constructor(entityManager: EntityManager) {
    super(SystemComponent, entityManager);
  }

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

  async getSystemComponents(
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

  async getSystemComponentsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemComponent[]> {
    return this.createQueryBuilder('msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.monitoringSystemRecordId IN (:...monSysIds)', { monSysIds })
      .orderBy('msc.id', 'ASC')
      .getMany();
  }

  async getSystemComponentByBeginOrEndDate(
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
