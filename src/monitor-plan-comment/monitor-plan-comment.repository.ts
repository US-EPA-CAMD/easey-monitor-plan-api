import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanComment } from '../entities/monitor-plan-comment.entity';

@Injectable()
export class MonitorPlanCommentRepository extends Repository<
  MonitorPlanComment
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanComment, entityManager);
  }
}
