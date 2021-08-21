import { EntityRepository, Repository } from 'typeorm';
import { MonitorAttribute } from '../entities/monitor-attribute.entity';

@EntityRepository(MonitorAttribute)
export class MonitorAttributeRepository extends Repository<MonitorAttribute> {}
