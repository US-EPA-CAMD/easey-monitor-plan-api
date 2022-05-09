import { EntityRepository, Repository } from 'typeorm';

import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';

@EntityRepository(MonitorQualification)
export class MonitorQualificationWorkspaceRepository extends Repository<
  MonitorQualification
> {
  async getQualificationByLocTypeDate(
    locId: string,
    qualType: string,
    beginDate: Date,
  ): Promise<MonitorQualification> {
    const result = this.createQueryBuilder('c')
      .where('c.locationId = :locId', {
        locId,
      })
      .andWhere(
        'c.qualificationTypeCode = :qualType AND c.beginDate = :beginDate',
        {
          qualType,
          beginDate,
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
