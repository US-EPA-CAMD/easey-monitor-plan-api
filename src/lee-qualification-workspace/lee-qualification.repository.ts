import { EntityRepository, Repository } from 'typeorm';

import { LEEQualification } from '../entities/workspace/lee-qualification.entity';

@EntityRepository(LEEQualification)
export class LEEQualificationWorkspaceRepository extends Repository<
  LEEQualification
> {}
