import { EntityRepository, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/workspace/monitor-default.entity';

@EntityRepository(MonitorDefault)
export class MonitorDefaultWorkspaceRepository extends Repository<
  MonitorDefault
> {}
