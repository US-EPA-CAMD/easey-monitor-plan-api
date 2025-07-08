import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Body, Put } from '@nestjs/common';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadBaseDTO, MonitorLoadDTO } from '../dtos/monitor-load.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Loads')
@ApiExcludeControllerByEnv()
@ApiExtraModels(MonitorLoadDTO)
export class MonitorLoadWorkspaceController {
  constructor(private readonly service: MonitorLoadWorkspaceService) { }

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
    label: 'Retrieved workspace monitor location loads',
    requestParamsOutFields: ['locId']
  })
  @ApiOkResponse({
    description: 'Retrieves official load records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(MonitorLoadDTO) },
              },
            },
          },
        },
      }
  })
  async getLoads(@Param('locId') locationId: string): Promise<ArrayResponse<MonitorLoadDTO>> {
    const loads = await this.service.getLoads(locationId);

    return  {
      items: loads
    };
  }

  @Put(':loadId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location load record',
    requestParamsOutFields: ['locId', 'loadId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    type: MonitorLoadDTO,
    description: 'Updates a workspace load record for a monitor location',
  })
  async updateLoad(
    @Param('locId') locationId: string,
    @Param('loadId') spanId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.updateLoad({
      locationId,
      loadId: spanId,
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
    label: 'Created workspace monitor location load record',
    requestParamsOutFields: ['locId'],
    responseBodyOutFields: '*'
  })
  @ApiOkResponse({
    isArray: true,
    type: MonitorLoadDTO,
    description: 'Creates a workspace load record for a monitor location',
  })
  createLoad(
    @Param('locId') locationId: string,
    @Body() payload: MonitorLoadBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorLoadDTO> {
    return this.service.createLoad({
      locationId,
      payload,
      userId: user.userId,
    });
  }
}
