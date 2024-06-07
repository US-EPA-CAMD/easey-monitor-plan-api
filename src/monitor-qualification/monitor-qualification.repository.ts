import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorQualification } from '../entities/monitor-qualification.entity';

@Injectable()
export class MonitorQualificationRepository extends Repository<
  MonitorQualification
> {
  constructor(entityManager: EntityManager) {
    super(MonitorQualification, entityManager);
  }
}
