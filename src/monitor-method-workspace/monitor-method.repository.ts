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

  async getMethodByLocIdParamBeginOrEndDate(
    locationId: string,
    parameterCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date | null,
    endHour: number | null,
  ): Promise<MonitorMethod | null> {

    const query = this.createQueryBuilder('mme')
      .where('mme.locationId = :locationId', { locationId })
      .andWhere('mme.parameterCode = :parameterCode', { parameterCode })
      .andWhere(`(mme.beginDate = :beginDate AND mme.beginHour = :beginHour)`,{ beginDate, beginHour },
    );

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('mme')
        .where('mme.locationId = :locationId', { locationId })
        .andWhere('mme.parameterCode = :parameterCode', { parameterCode })
        .andWhere('mme.endDate = :endDate AND mme.endHour = :endHour', { endDate, endHour, });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
