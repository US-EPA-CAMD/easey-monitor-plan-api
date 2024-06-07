import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';

@Injectable()
export class MonitorQualificationWorkspaceRepository extends Repository<
  MonitorQualification
> {
  constructor(entityManager: EntityManager) {
    super(MonitorQualification, entityManager);
  }

  async getQualificationByLocTypeDate(
    locationId: string,
    qualType: string,
    beginDate: Date,
    endDate: Date,
  ): Promise<MonitorQualification> {
    const result = this.createQueryBuilder('c')
      .where('c.locationId = :locationId', { locationId })
      .andWhere('c.qualificationTypeCode = :qualType', { qualType })
      .andWhere(
        `((
          c.beginDate = :beginDate
        ) OR (
          c.endDate IS NOT NULL AND c.endDate = :endDate
        ))`,
        {
          qualType,
          beginDate,
          endDate,
        },
      )
      .getOne();

    return result;
  }

  async getQualification(
    locId: string,
    qualId: string,
  ): Promise<MonitorQualification> {
    return this.createQueryBuilder('q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualId', { qualId })
      .addOrderBy('q.id')
      .getOne();
  }
}
