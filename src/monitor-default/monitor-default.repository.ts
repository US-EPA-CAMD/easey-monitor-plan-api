import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorDefault } from '../entities/monitor-default.entity';

@Injectable()
export class MonitorDefaultRepository extends Repository<MonitorDefault> {
  constructor(entityManager: EntityManager) {
    super(MonitorDefault, entityManager);
  }
}
