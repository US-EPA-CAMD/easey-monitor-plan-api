import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
export class MonitorPlanCommentWorkspaceController {
  constructor(private readonly service: MonitorPlanCommentWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanCommentDTO,
    description: 'Retrieves workspace comment records for a monitor plan',
  })
  @RoleGuard({ pathParam: 'planId' }, LookupType.MonitorPlan)
  getComments(
    @Param('planId') planId: string,
  ): Promise<MonitorPlanCommentDTO[]> {
    return this.service.getComments(planId);
  }
}
