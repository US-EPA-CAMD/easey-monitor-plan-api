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

  async getQualificationByLogicalKey(
    locationId: string,
    qualType: string,
    beginDate: Date,
  ): Promise<MonitorQualification | null> {
    return this.createQueryBuilder('c')
      .where('c.locationId = :locationId', { locationId })
      .andWhere('c.qualificationTypeCode = :qualType', { qualType })
      .andWhere('c.beginDate = :beginDate', { beginDate })
      .getOne();
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
