import { Injectable } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class MonitorPlanCommentService {
  constructor(
    private map: MonitorPlanCommentMap,
    private readonly dataSource: DataSource,
  ) {}

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MonitorPlanCommentRepository, async (repository) => repository.findBy({ monitorPlanId: planId }));
    return this.map.many(results);
  }
}
