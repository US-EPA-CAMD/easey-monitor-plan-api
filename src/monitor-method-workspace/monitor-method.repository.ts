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

  async getMethodByLocIdParamCDBDate(
    locationId: string,
    parameterCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorMethod> {
    const query = this.createQueryBuilder('mme')
      .where('mme.locationId = :locationId', {
        locationId,
      })
      .andWhere('mme.parameterCode = :parameterCode', {
        parameterCode,
      })
      .andWhere(
        `(mme.beginDate = :beginDate AND mme.beginHour = :beginHour)`,
        { beginDate, beginHour }
      )

      if (endDate !== null && endHour !== null) {
        query.andWhere(
          '(mme.endDate = :endDate AND mme.endHour = :endHour)',
          { endDate, endHour }
        );
      } else {
        query.andWhere('mme.endDate IS NULL AND mme.endHour IS NULL');
      }
      

      return query.getOne();
  }
}
