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
    return this.findOne({
      where: {
        locationId,
        parameterCode,
        beginDate,
        endDate,
      },
    });
  }
}
