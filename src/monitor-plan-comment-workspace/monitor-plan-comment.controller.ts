import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { ComponentDTO } from '../dtos/component.dto';

const ArrayResponseMonitorPlanCommentDTO = createArrayResponseDto(MonitorPlanCommentDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
@ApiExcludeControllerByEnv()
export class MonitorPlanCommentWorkspaceController {
  constructor(private readonly service: MonitorPlanCommentWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorPlanCommentDTO,
    description: 'Retrieves workspace comment records for a monitor plan',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'planId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Retrieved workspace comments',
    requestParamsOutFields: ['planId'],
  })
  async getComments(
    @Param('planId') planId: string,
  ): Promise<ArrayResponse<MonitorPlanCommentDTO>> {
    const monitorPlanCommentDTOS = await this.service.getComments(planId);

    return  {
      items: monitorPlanCommentDTOS
    };
  }
}
