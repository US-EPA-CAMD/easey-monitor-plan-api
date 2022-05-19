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
  ): Promise<MonitorMethod> {
    return this.createQueryBuilder('mm')
      .where('mm.locationId = :locationId', {
        locationId,
      })
      .andWhere('mm.parameterCode = :parameterCode', { parameterCode })
      .andWhere('mm.beginDate = :beginDate', { beginDate })
      .getOne();
  }
}
