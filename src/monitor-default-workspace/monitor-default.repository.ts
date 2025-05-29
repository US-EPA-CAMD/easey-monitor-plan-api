import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/workspace/monitor-default.entity';

@Injectable()
export class MonitorDefaultWorkspaceRepository extends Repository<
  MonitorDefault
> {
  constructor(entityManager: EntityManager) {
    super(MonitorDefault, entityManager);
  }

  async getDefault(locationId: string, id: string): Promise<MonitorDefault> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.id = :id ', { id })
      .getOne();
  }

  async getDefaultBySpecsBeginOrEndDate(
    locationId: string,
    parameterCode: string,
    defaultPurposeCode: string,
    fuelCode: string,
    operatingConditionCode: string,
    beginDate: Date,
    beginHour: number,
    endDate: Date | null,
    endHour: number | null,
  ): Promise<MonitorDefault | null> {
    const query = this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.parameterCode = :parameterCode', { parameterCode })
      .andWhere('md.defaultPurposeCode = :defaultPurposeCode', { defaultPurposeCode })
      .andWhere('md.fuelCode = :fuelCode', { fuelCode })
      .andWhere('md.operatingConditionCode = :operatingConditionCode', { operatingConditionCode })
      .andWhere('(md.beginDate = :beginDate AND md.beginHour = :beginHour)', {
        beginDate,
        beginHour,
      });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('md')
        .where('md.locationId = :locationId', { locationId })
        .andWhere('md.parameterCode = :parameterCode', { parameterCode })
        .andWhere('md.defaultPurposeCode = :defaultPurposeCode', { defaultPurposeCode })
        .andWhere('md.fuelCode = :fuelCode', { fuelCode })
        .andWhere('md.operatingConditionCode = :operatingConditionCode', { operatingConditionCode })
        .andWhere('(md.endDate = :endDate AND md.endHour = :endHour)', {
          endDate,
          endHour,
        });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
