import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorPlanComment } from '../entities/monitor-plan-comment.entity';
import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';

@Injectable()
export class MonitorPlanCommentMap extends BaseMap<MonitorPlanComment, MonitorPlanCommentDTO> {
  public async one(entity: MonitorPlanComment): Promise<MonitorPlanCommentDTO> {
    return {
      id: entity.id,
      planId: entity.monitorPlanId,
      monitoringPlanComment: entity.monitorPlanComment,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
