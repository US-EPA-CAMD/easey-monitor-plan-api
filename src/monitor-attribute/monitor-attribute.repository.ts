import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorAttribute } from '../entities/monitor-attribute.entity';

@Injectable()
export class MonitorAttributeRepository extends Repository<MonitorAttribute> {
  constructor(entityManager: EntityManager) {
    super(MonitorAttribute, entityManager);
  }
}
