import { EntityRepository, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/monitor-default.entity';

@EntityRepository()
export class MonitorDefaultRepository extends Repository<MonitorDefault> {}
