import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';

@Injectable()
export class MonitorPlanCommentWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanCommentWorkspaceRepository)
    private repository: MonitorPlanCommentWorkspaceRepository,
    private map: MonitorPlanCommentMap,
  ) {}

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    const results = await this.repository.find({ monitorPlanId: planId });
    return this.map.many(results);
  }
}
