import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorPlanComment } from '../entities/monitor-plan-comment.entity';
import { MonitorPlanComment as WorkspaceMonitorPlanComment } from '../entities/workspace/monitor-plan-comment.entity';
import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';

@Injectable()
export class MonitorPlanCommentMap extends BaseMap<
  MonitorPlanComment | WorkspaceMonitorPlanComment,
  MonitorPlanCommentDTO
> {
  public async one(
    entity: MonitorPlanComment | WorkspaceMonitorPlanComment,
  ): Promise<MonitorPlanCommentDTO> {
    return {
      id: entity.id,
      planId: entity.monitorPlanId,
      monitoringPlanComment: entity.monitorPlanComment,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
