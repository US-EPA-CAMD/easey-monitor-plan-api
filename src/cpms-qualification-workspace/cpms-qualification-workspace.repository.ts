import { EntityRepository, Repository } from 'typeorm';
import { CPMSQualification } from '../entities/workspace/cpms-qualification.entity';

@EntityRepository(CPMSQualification)
export class CPMSQualificationWorkspaceRepository extends Repository<
  CPMSQualification
> {
  async getCPMSQualifications(
    locId: string,
    qualificationId: string,
  ): Promise<CPMSQualification[]> {
    return this.createQueryBuilder('cpms')
      .innerJoinAndSelect('cpms.qualification', 'q')
      .innerJoinAndSelect('q.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('q.id = :qualificationId', { qualificationId })
      .addOrderBy('cpms.id')
      .getMany();
  }
}
