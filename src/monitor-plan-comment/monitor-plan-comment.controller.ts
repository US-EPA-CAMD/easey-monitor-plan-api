import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
export class MonitorPlanCommentController {
  constructor(private service: MonitorPlanCommentService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanCommentDTO,
    description: 'Retrieves official comment records for a monitor plan',
  })
  getComments(
    @Param('planId') planId: string,
  ): Promise<MonitorPlanCommentDTO[]> {
    return this.service.getComments(planId);
  }
}
