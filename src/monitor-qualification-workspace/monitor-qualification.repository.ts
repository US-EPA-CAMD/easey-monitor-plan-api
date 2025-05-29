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

  async getQualificationByLocTypeBeginOrEndDate(
    locationId: string,
    qualType: string,
    beginDate: Date,
    endDate: Date | null,
  ): Promise<MonitorQualification | null> {
    const query = this.createQueryBuilder('c')
      .where('c.locationId = :locationId', { locationId })
      .andWhere('c.qualificationTypeCode = :qualType', { qualType })
      .andWhere('c.beginDate = :beginDate', { beginDate });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null) {
      const endQuery = this.createQueryBuilder('c')
        .where('c.locationId = :locationId', { locationId })
        .andWhere('c.qualificationTypeCode = :qualType', { qualType })
        .andWhere('c.endDate = :endDate', { endDate });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
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
