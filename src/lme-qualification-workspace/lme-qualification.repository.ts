import { EntityRepository, Repository } from 'typeorm';

import { LMEQualification } from '../entities/workspace/lme-qualification.entity';

@EntityRepository(LMEQualification)
export class LMEQualificationWorkspaceRepository extends Repository<
  LMEQualification
> {}
