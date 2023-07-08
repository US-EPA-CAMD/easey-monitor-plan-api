import { EntityRepository, Repository } from 'typeorm';
import { CPMSQualification } from '../entities/workspace/cpms-qualification.entity';

@EntityRepository(CPMSQualification)
export class CPMSQualificationWorkspaceRepository extends Repository<
  CPMSQualification
> {}
