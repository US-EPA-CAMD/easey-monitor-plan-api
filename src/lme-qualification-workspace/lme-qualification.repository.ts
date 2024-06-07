import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LMEQualification } from '../entities/workspace/lme-qualification.entity';

@Injectable()
export class LMEQualificationWorkspaceRepository extends Repository<
  LMEQualification
> {
  constructor(entityManager: EntityManager) {
    super(LMEQualification, entityManager);
  }

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

  async getLMEQualificationByDataYear(
    locId: string,
    qualificationId: string,
    qualDataYear: number,
  ): Promise<LMEQualification> {
    return this.createQueryBuilder('lmeq')
      .innerJoinAndSelect('lmeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('lmeq.qualificationDataYear = :qualDataYear', { qualDataYear })
      .getOne();
  }
}
