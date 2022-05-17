import { EntityRepository, Repository } from 'typeorm';

import { PCTQualification } from '../entities/workspace/pct-qualification.entity';

@EntityRepository(PCTQualification)
export class PCTQualificationWorkspaceRepository extends Repository<
  PCTQualification
> {
  async getPCTQualifications(
    locId: string,
    qualificationId: string,
  ): Promise<PCTQualification[]> {
    return this.createQueryBuilder('pctq')
      .innerJoinAndSelect('pctq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .addOrderBy('pctq.id')
      .getMany();
  }

  async getPCTQualification(
    locId: string,
    qualificationId: string,
    pctQualId: string,
  ): Promise<PCTQualification> {
    return this.createQueryBuilder('pctq')
      .innerJoinAndSelect('pctq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('pctq.id = :pctQualId', { pctQualId })
      .addOrderBy('pctq.id')
      .getOne();
  }

  async getPCTQualificationByDataYear(
    locId: string,
    qualificationId: string,
    qualDataYear: number,
  ): Promise<PCTQualification> {
    return this.createQueryBuilder('pctq')
      .innerJoinAndSelect('pctq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('pctq.qualificationYear = :qualDataYear', { qualDataYear })
      .getOne();
  }
}
