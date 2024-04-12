import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorMethod } from '../entities/monitor-method.entity';

@Injectable()
export class MonitorMethodRepository extends Repository<MonitorMethod> {
  constructor(entityManager: EntityManager) {
    super(MonitorMethod, entityManager);
  }
}
