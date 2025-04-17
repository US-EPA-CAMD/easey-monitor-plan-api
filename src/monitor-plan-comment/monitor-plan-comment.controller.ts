import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseMonitorPlanCommentDTO = createArrayResponseDto(MonitorPlanCommentDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
export class MonitorPlanCommentController {
  constructor(private service: MonitorPlanCommentService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorPlanCommentDTO,
    description: 'Retrieves official comment records for a monitor plan',
  })
  async getComments(
    @Param('planId') planId: string,
  ): Promise<ArrayResponse<MonitorPlanCommentDTO>> {
    const comments = await this.service.getComments(planId);

    return  {
      items: comments
    }
  }
}
