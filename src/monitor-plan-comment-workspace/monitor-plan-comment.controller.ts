import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';
import { MonitorPlanCommentDTO, MonitorPlanCommentBaseDTO } from '../dtos/monitor-plan-comment.dto';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Comments')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorPlanCommentDTO)
export class MonitorPlanCommentWorkspaceController {
  constructor(private readonly service: MonitorPlanCommentWorkspaceService) {}

  @Get('comments')
  @ApiOkResponse({
    description: 'Retrieves workspace comment records for a monitor plan',
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

  @Put('comments/:monitorPlantCommentId')
  @RoleGuard(
    {
      pathParam: 'planId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.MonitorPlan,
  )
    @AuditLog({
      label: 'Update workspace Monitor Plan Comment record',
      requestParamsOutFields: ['planId'],
      requestBodyOutFields:'*'
    })
    @ApiOkResponse({
      type: MonitorPlanCommentDTO,
      description: 'Updates a workspace Monitor Plan Comment record by Monitor Plant Comment ID',
    })
    async updatePlanMonitorComment(
      @Param('planId') monPlanId: string,
      @Param('monitorPlantCommentId') monitorPlantCommentId: string,
      @Body() payload: MonitorPlanCommentBaseDTO,
      @User() user: CurrentUser,
    ): Promise<any> {
      return this.service.updateComment(
        monPlanId,
        payload,
        user.userId,
        monitorPlantCommentId
      );
    }

  @Post('comments/')
  @RoleGuard(
    {
      pathParam: 'planId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.MonitorPlan,
  )
    @AuditLog({
      label: 'Create workspace Monitor Plan Comment record',
      requestParamsOutFields: ['planId'],
      requestBodyOutFields:'*'
    })
    @ApiOkResponse({
      type: MonitorPlanCommentDTO,
      description: 'Create a workspace Monitor Plan Comment record by Monitor Plant Comment ID',
    })
    async createUnitCapacity(
      @Param('planId') monPlanId: string,
      @Body() payload: MonitorPlanCommentBaseDTO,
      @User() user: CurrentUser,
    ): Promise<MonitorPlanCommentDTO> {
      return this.service.createComment(
        monPlanId,
        payload,
        user.userId,
      );
    }
}
