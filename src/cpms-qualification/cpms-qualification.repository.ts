import { EntityRepository, Repository } from 'typeorm';
import { CPMSQualification } from '../entities/cpms-qualification.entity';

@EntityRepository(CPMSQualification)
export class CPMSQualificationRepository extends Repository<
  CPMSQualification
> {}
