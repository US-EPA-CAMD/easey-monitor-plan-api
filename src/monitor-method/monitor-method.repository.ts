import { Repository, EntityRepository } from 'typeorm';

import { MonitorMethod } from '../entities/monitor-method.entity';

@EntityRepository(MonitorMethod)
export class MonitorMethodRepository extends Repository<MonitorMethod> {}
