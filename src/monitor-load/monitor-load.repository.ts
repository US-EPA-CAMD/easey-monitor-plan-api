import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorLoad } from '../entities/monitor-load.entity';

@Injectable()
export class MonitorLoadRepository extends Repository<MonitorLoad> {
  constructor(entityManager: EntityManager) {
    super(MonitorLoad, entityManager);
  }
}
