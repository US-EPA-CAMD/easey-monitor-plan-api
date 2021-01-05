import { Repository, EntityRepository } from 'typeorm';

import { MonitorMethodData } from '../entities/monitor-method.entity';

@EntityRepository(MonitorMethodData)
export class MonitorMethodRepository extends Repository<MonitorMethodData>{

}