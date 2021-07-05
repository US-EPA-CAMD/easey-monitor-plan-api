import { Repository, EntityRepository } from 'typeorm';

import { MonitorSpan } from '../entities/monitor-span.entity';

@EntityRepository(MonitorSpan)
export class MonitorSpanRepository extends Repository<MonitorSpan> {}
