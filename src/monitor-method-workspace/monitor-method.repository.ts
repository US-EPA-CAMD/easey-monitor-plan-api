import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorMethod } from '../entities/workspace/monitor-method.entity';

@Injectable()
export class MonitorMethodWorkspaceRepository extends Repository<
  MonitorMethod
> {
  constructor(entityManager: EntityManager) {
    super(MonitorMethod, entityManager);
  }

  async getMethodByLogicalKey(
    locationId: string,
    parameterCode: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<MonitorMethod | null> {

    return this.createQueryBuilder('mme')
      .where('mme.locationId = :locationId', { locationId })
      .andWhere('mme.parameterCode = :parameterCode', { parameterCode })
      .andWhere('mme.beginDate = :beginDate', { beginDate })
      .andWhere('mme.beginHour = :beginHour', { beginHour })
      .getOne();
  }

}
