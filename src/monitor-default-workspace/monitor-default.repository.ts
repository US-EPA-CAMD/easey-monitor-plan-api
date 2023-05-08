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
    defaultPurposeCode: string,
    fuelCode: string,
    operatingConditionCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date,
    endHour: number,
  ): Promise<MonitorDefault> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.parameterCode = :parameterCode', { parameterCode })
      .andWhere('md.defaultPurposeCode = :defaultPurposeCode', { defaultPurposeCode })
      .andWhere('md.fuelCode = :fuelCode', { fuelCode })
      .andWhere('md.operatingConditionCode = :operatingConditionCode', { operatingConditionCode })
      .andWhere(`((
          md.beginDate = :beginDate AND md.beginHour = :beginHour
        ) OR (
          md.endDate IS NOT NULL AND md.endDate = :endDate AND md.endHour = :endHour
        ))`,
      {
        beginDate,
        beginHour,
        endDate,
        endHour,
      })
      .getOne();
  }
}
