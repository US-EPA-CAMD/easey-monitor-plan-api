import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorPlanCommentDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
@ApiExtraModels(MonitorPlanCommentDTO)
export class MonitorPlanCommentController {
  constructor(private service: MonitorPlanCommentService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official comment records for a monitor plan',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorPlanCommentDTO) },
              },
            },
          },
        },
      }
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
