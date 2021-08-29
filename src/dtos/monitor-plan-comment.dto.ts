import { MonitorPlanCommentBaseDTO } from './monitor-plan-comment-base.dto';

export class MonitorPlanCommentDTO extends MonitorPlanCommentBaseDTO {
  id: string;
  planId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
