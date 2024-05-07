import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CPMSQualification } from '../entities/cpms-qualification.entity';

@Injectable()
export class CPMSQualificationRepository extends Repository<CPMSQualification> {
  constructor(entityManager: EntityManager) {
    super(CPMSQualification, entityManager);
  }

  async getCPMSQualifications(
    locId: string,
    qualificationId: string,
  ): Promise<CPMSQualification[]> {
    return this.createQueryBuilder('cpmsq')
      .innerJoinAndSelect('cpmsq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .addOrderBy('cpmsq.id')
      .getMany();
  }
}
