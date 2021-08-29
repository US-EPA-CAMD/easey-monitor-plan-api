import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlanComment } from '../entities/monitor-plan-comment.entity';

@EntityRepository(MonitorPlanComment)
export class MonitorPlanCommentRepository extends Repository<
  MonitorPlanComment
> {}
