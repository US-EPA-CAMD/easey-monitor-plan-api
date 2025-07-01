import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Put, Body } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanChecksService } from './monitor-span-checks.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Spans')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorSpanDTO)
export class MonitorSpanWorkspaceController {
  constructor(
    private service: MonitorSpanWorkspaceService,
    private checksService: MonitorSpanChecksService,
  ) {}

  @Get()
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location spans',
    requestParamsOutFields:['locId']
  })
  @ApiOkResponse({
    description: 'Retrieves workspace span records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorSpanDTO) },
              },
            },
          },
        },
      }
  })
  async getSpans(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorSpanDTO>> {
    const spans = await this.service.getSpans(locationId);

    return  {
      items: spans
    }
  }

  @Put(':spanId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location span record',
    requestParamsOutFields:['locId', 'spanId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    type: MonitorSpanDTO,
    description: 'Updates a workspace span record for a monitor location',
  })
  async updateSpan(
    @Param('locId') locationId: string,
    @Param('spanId') spanId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSpanDTO> {
    await this.checksService.runChecks(payload, locationId);
    return this.service.updateSpan({
      locationId,
      spanId,
      payload,
      userId: user.userId,
    });
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Created workspace monitor location span record',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:'*'
  })
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Creates a workspace span record for a monitor location',
  })
  async createSpan(
    @Param('locId') locationId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSpanDTO> {
    await this.checksService.runChecks(payload, locationId, true);
    return this.service.createSpan({
      locationId,
      payload,
      userId: user.userId,
    });
  }
}
