import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorSpan } from '../entities/monitor-span.entity';

@Injectable()
export class MonitorSpanRepository extends Repository<MonitorSpan> {
  constructor(entityManager: EntityManager) {
    super(MonitorSpan, entityManager);
  }
}
