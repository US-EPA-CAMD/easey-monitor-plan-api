import { EntityRepository, Repository } from 'typeorm';

import { LEEQualification } from '../entities/workspace/lee-qualification.entity';

@EntityRepository(LEEQualification)
export class LEEQualificationWorkspaceRepository extends Repository<
  LEEQualification
> {
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
}
