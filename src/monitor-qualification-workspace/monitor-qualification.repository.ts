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
    endDate: Date,
  ): Promise<MonitorQualification> {
    const result = this.createQueryBuilder('c')
      .where('c.locationId = :locId', {
        locId,
      })
      .andWhere(
        '((c.qualificationTypeCode = :qualType AND c.beginDate = :beginDate AND  c.beginHour = :beginHour) OR (( c.endDate is not null) AND (  c.endDate = :endDate AND  c.endHour = :endHour )))',
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
