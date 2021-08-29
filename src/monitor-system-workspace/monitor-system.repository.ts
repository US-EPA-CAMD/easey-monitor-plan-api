import { Repository, EntityRepository } from 'typeorm';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

@EntityRepository(MonitorSystem)
export class MonitorSystemWorkspaceRepository extends Repository<
  MonitorSystem
> {}
