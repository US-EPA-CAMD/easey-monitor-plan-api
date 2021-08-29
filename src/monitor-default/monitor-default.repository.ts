import { EntityRepository, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/monitor-default.entity';

@EntityRepository(MonitorDefault)
export class MonitorDefaultRepository extends Repository<MonitorDefault> {}
