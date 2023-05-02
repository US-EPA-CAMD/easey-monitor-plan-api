import { Repository, EntityRepository } from 'typeorm';

import { MonitorMethod } from '../entities/workspace/monitor-method.entity';

@EntityRepository(MonitorMethod)
export class MonitorMethodWorkspaceRepository extends Repository<
  MonitorMethod
> {
  async getMethodByLocIdParamCDBDate(
    locationId: string,
    parameterCode: string,
    beginDate: Date,
    endDate: Date,

  ): Promise<MonitorMethod> {
    const result = this.createQueryBuilder('mme')
      .where('mme.locationId = :locationId', {
        locationId,
      })
      .andWhere(
        '(mme.beginDate = :beginDate AND mme.beginHour = :beginHour) OR ( mme.endDate = :endDate AND mme.endHour = :endHour )',
        {
          parameterCode,
          beginDate,
          endDate,
        },
      )
      .getOne();

    return result;
  }
}
