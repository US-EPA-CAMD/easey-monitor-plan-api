import { EntityRepository, Repository } from 'typeorm';

import { LMEQualification } from '../entities/workspace/lme-qualification.entity';

@EntityRepository(LMEQualification)
export class LMEQualificationWorkspaceRepository extends Repository<
  LMEQualification
> {
  async getLMEQualifications(
    locId: string,
    qualificationId: string,
  ): Promise<LMEQualification[]> {
    return this.createQueryBuilder('lmeq')
      .innerJoinAndSelect('lmeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .addOrderBy('lmeq.id')
      .getMany();
  }

  async getLMEQualification(
    locId: string,
    qualificationId: string,
    lmeQualId: string,
  ): Promise<LMEQualification> {
    return this.createQueryBuilder('lmeq')
      .innerJoinAndSelect('lmeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('lmeq.id = :lmeQualId', { lmeQualId })
      .addOrderBy('lmeq.id')
      .getOne();
  }
}
