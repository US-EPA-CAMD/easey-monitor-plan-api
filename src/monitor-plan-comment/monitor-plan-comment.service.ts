import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';

@Injectable()
export class MonitorPlanCommentService {
  constructor(
    @InjectRepository(MonitorPlanCommentRepository)
    private repository: MonitorPlanCommentRepository,
    private map: MonitorPlanCommentMap,
    private readonly logger: Logger,
  ) {}

  async getComments(planId: string): Promise<MonitorPlanCommentDTO[]> {
    let result;
    try {
      result = await this.repository.find({ monitorPlanId: planId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
