import { Repository, EntityRepository } from 'typeorm';

import { MonitorLoad } from '../entities/workspace/monitor-load.entity';

@EntityRepository(MonitorLoad)
export class MonitorLoadWorkspaceRepository extends Repository<MonitorLoad> {}
