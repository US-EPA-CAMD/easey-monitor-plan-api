import { Repository, EntityRepository } from 'typeorm';

import { MonitorSystem } from '../entities/monitor-system.entity';

@EntityRepository(MonitorSystem)
export class MonitorSystemRepository extends Repository<MonitorSystem>{

}