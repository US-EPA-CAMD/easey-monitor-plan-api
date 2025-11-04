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

  async getDefaultByLogicalKey(
    locationId: string,
    parameterCode: string,
    defaultPurposeCode: string,
    fuelCode: string,
    operatingConditionCode: string,
    beginDate: Date,
    beginHour: number,
  ): Promise<MonitorDefault | null> {
    return this.createQueryBuilder('md')
      .where('md.locationId = :locationId', { locationId })
      .andWhere('md.parameterCode = :parameterCode', { parameterCode })
      .andWhere('md.defaultPurposeCode = :defaultPurposeCode', { defaultPurposeCode })
      .andWhere('md.fuelCode = :fuelCode', { fuelCode })
      .andWhere('md.operatingConditionCode = :operatingConditionCode', { operatingConditionCode })
      .andWhere('md.beginDate = :beginDate', { beginDate })
      .andWhere('md.beginHour = :beginHour', { beginHour })
      .getOne();
  }
}
