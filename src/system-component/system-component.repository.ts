import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, DataSource } from 'typeorm';

import { SystemComponent } from '../entities/system-component.entity';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class SystemComponentRepository extends Repository<SystemComponent> {
  constructor(private readonly dataSource: DataSource, entityManager: EntityManager) {
    super(SystemComponent, entityManager);
  }

  async getComponents(
    locationId: string,
    monSysId: string,
  ): Promise<SystemComponent[]> {
    return withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(SystemComponent, 'msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('c.locationId = :locationId', { locationId })
      .andWhere('msc.monitoringSystemRecordId = :monSysId', { monSysId })
      .orderBy('c.componentId', 'ASC')
      .getMany();
    });
  }

  async getComponentsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemComponent[]> {
      return withSlaveConnection(this.dataSource, async (qr) => {
        return qr.createQueryBuilder(SystemComponent, 'msc')
      .innerJoinAndSelect('msc.component', 'c')
      .where('msc.monitoringSystemRecordId IN (:...monSysIds)', { monSysIds })
      .orderBy('msc.id', 'ASC')
      .getMany();
      });
  }
}
