import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LEEQualification } from '../entities/workspace/lee-qualification.entity';

@Injectable()
export class LEEQualificationWorkspaceRepository extends Repository<
  LEEQualification
> {
  constructor(entityManager: EntityManager) {
    super(LEEQualification, entityManager);
  }

  async getLEEQualifications(
    locId: string,
    qualificationId: string,
  ): Promise<LEEQualification[]> {
    return this.createQueryBuilder('leeq')
      .innerJoinAndSelect('leeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .addOrderBy('leeq.id')
      .getMany();
  }

  async getLEEQualification(
    locId: string,
    qualificationId: string,
    leeQualId: string,
  ): Promise<LEEQualification> {
    return this.createQueryBuilder('leeq')
      .innerJoinAndSelect('leeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('leeq.id = :leeQualId', { leeQualId })
      .addOrderBy('leeq.id')
      .getOne();
  }

  async getLEEQualificationByTestDate(
    locId: string,
    qualificationId: string,
    qualTestDate: Date,
  ): Promise<LEEQualification> {
    return this.createQueryBuilder('leeq')
      .innerJoinAndSelect('leeq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('leeq.qualificationTestDate = :qualTestDate', { qualTestDate })
      .getOne();
  }
}
