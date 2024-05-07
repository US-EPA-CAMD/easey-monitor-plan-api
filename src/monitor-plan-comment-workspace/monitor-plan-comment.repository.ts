import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlanComment } from '../entities/workspace/monitor-plan-comment.entity';

@Injectable()
export class MonitorPlanCommentWorkspaceRepository extends Repository<
  MonitorPlanComment
> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlanComment, entityManager);
  }
}
