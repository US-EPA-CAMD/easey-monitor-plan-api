import { EntityRepository, Repository } from 'typeorm';
import { CPMSQualification } from '../entities/cpms-qualification.entity';

@EntityRepository(CPMSQualification)
export class CPMSQualificationRepository extends Repository<CPMSQualification> {
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
