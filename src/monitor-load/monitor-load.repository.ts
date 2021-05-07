import { Repository, EntityRepository } from 'typeorm';

import { MonitorLoad } from '../entities/monitor-load.entity';

@EntityRepository(MonitorLoad)
export class MonitorLoadRepository extends Repository<MonitorLoad> {}
