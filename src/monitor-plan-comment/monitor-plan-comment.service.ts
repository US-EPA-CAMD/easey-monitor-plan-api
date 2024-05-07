import { Injectable } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';

@Injectable()
export class MonitorPlanCommentService {
  constructor(
    private repository: MonitorPlanCommentRepository,
    private map: MonitorPlanCommentMap,
  ) {}

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    const results = await this.repository.findBy({ monitorPlanId: planId });
    return this.map.many(results);
  }
}
