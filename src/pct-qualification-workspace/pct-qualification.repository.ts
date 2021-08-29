import { EntityRepository, Repository } from 'typeorm';

import { PCTQualification } from '../entities/workspace/pct-qualification.entity';

@EntityRepository(PCTQualification)
export class PCTQualificationWorkspaceRepository extends Repository<
  PCTQualification
> {}
