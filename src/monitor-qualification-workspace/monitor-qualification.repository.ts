import { EntityRepository, Repository } from 'typeorm';

import { MonitorQualification } from '../entities/workspace/monitor-qualification.entity';

@EntityRepository(MonitorQualification)
export class MonitorQualificationWorkspaceRepository extends Repository<
  MonitorQualification
> {}
