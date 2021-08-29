import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlanComment } from '../entities/workspace/monitor-plan-comment.entity';

@EntityRepository(MonitorPlanComment)
export class MonitorPlanCommentWorkspaceRepository extends Repository<
  MonitorPlanComment
> {}
