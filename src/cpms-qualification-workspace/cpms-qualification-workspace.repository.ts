import { EntityRepository, Repository } from 'typeorm';
import { CPMSQualification } from '../entities/workspace/cpms-qualification.entity';

@EntityRepository(CPMSQualification)
export class CPMSQualificationWorkspaceRepository extends Repository<
  CPMSQualification
> {
  async getCPMSQualification(
    locId: string,
    qualificationId: string,
    cpmsQualId: string,
  ): Promise<CPMSQualification> {
    return this.createQueryBuilder('cpmsq')
      .innerJoinAndSelect('cpmsq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('cpmsq.id = :cpmsQualId', { cpmsQualId })
      .addOrderBy('cpmsq.id')
      .getOne();
  }

  async getCPMSQualificationByStackTestNumber(
    locId: string,
    qualificationId: string,
    stackTestNumber: string,
  ): Promise<CPMSQualification> {
    return this.createQueryBuilder('cpmsq')
      .innerJoinAndSelect('cpmsq.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .andWhere('cpmsq.stackTestNumber = :stackTestNumber', { stackTestNumber })
      .getOne();
  }
}
