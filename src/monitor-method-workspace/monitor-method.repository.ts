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
    beginHour: number,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorMethod> {
    const result = this.createQueryBuilder('mme')
      .where('mme.locationId = :locationId', {
        locationId,
      })
      .andWhere('mme.parameterCode = :parameterCode', {
        parameterCode
      })
      .andWhere(
        '(mme.beginDate = :beginDate AND mme.beginHour = :beginHour) OR (mme.endDate is not null AND mme.endDate = :endDate AND mme.endHour = :endHour)',
        {
          beginDate,
          beginHour,
          endDate,
          endHour,
        },
      )
      .getOne();

    return result;
  }
}
