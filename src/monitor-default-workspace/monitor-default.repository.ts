import { EntityRepository, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/workspace/monitor-default.entity';

@EntityRepository(MonitorDefault)
export class MonitorDefaultWorkspaceRepository extends Repository<
  MonitorDefault
> {
  async getDefault(locationId: string, id: string): Promise<MonitorDefault> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.id = :id ', { id })
      .getOne();
  }

  async getDefaultBySpecs(
    locationId: string,
    parameterCode: string,
    defaultValue: number,
    beginDate: Date,
    beginHour: number,
  ): Promise<MonitorDefault> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.parameterCode = :parameterCode', { parameterCode })
      .andWhere('md.defaultValue = :defaultValue', { defaultValue })
      .andWhere('md.beginDate = :beginDate', { beginDate })
      .andWhere('md.beginHour = :beginHour', { beginHour })
      .getOne();
  }
}
