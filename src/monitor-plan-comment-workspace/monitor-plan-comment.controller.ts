import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';

@ApiTags('Comments')
@Controller()
export class MonitorPlanCommentWorkspaceController {
  constructor(private service: MonitorPlanCommentWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanCommentDTO,
    description: 'Retrieves workspace comment records for a monitor plan',
  })
  getComments(
    @Param('planId') planId: string,
  ): Promise<MonitorPlanCommentDTO[]> {
    return this.service.getComments(planId);
  }
}
